
function createMedication(manufacturer, expiryDate, name,antiCounterfeitCode, ownerid, location) {
    return {
        docType: 'medication',
        manufacturer: manufacturer,
        expiryDate: expiryDate,
        name: name,
        antiCounterfeitCode: antiCounterfeitCode,
        owner: ownerid,
        location: location
    };
}

function createTransaction(time,medicationName,patientId,hospitalId, quantity,location) {
    return {
        docType: 'transaction',
        timestamp: time,
        medicationName: medicationName,
        quantity: quantity,
        patientId: patientId,
        hospitalId: hospitalId,
        location: location
    };
}


function createOrder(hospitalId,supplierId, med_name, quantity,time,status,location) {
    return {
        docType: 'order',
        hospitalId: hospitalId,
        supplierId: supplierId,
        medicine_name: med_name,
        quantity: quantity,
        orderTime: time,
        status: status,
        location: location
    };
}

function lcg(seed) {
    // Parameters of the linear congruence generator
    const a = 1664525;
    const c = 1013904223;
    const m = 2**32;

    // Returns a function that generates the next random number each time it is called
    return function() {
        seed = (a * seed + c) % m;
        return seed;
    };
}


const stringify  = require('json-stringify-deterministic');
const { Contract } = require('fabric-contract-api');
const crypto = require('crypto');


class MedicationContract extends Contract {

    
    /**
     * Initializes the ledger with sample medication data.
     * @param {Context} ctx The transaction context object.
     * @returns {Promise<void>}
     */
    async InitLedger(ctx) {
        
        const medicationA = [{
            docType: 'medication',
            manufacturer: 'Manufacturer A',
            antiCounterfeitCode: 'Code123456',
            expiryDate: '2023-12-31',
            name: 'Medicine A',
            owner: 'SUPPLIER_0',
            location: 'Shanghai'
            
        },
        {
            docType: 'medication',
            manufacturer: 'Manufacturer A',
            antiCounterfeitCode: 'Code678901',
            expiryDate: '2024-05-01',
            name: 'Medicine A',
            owner: 'SUPPLIER_0',
            location: 'Shanghai'
            
        },
        {
            docType: 'medication',
            manufacturer: 'Manufacturer A',
            antiCounterfeitCode: 'Code112233',
            expiryDate: '2023-10-15',
            name: 'Medicine A',
            owner: 'SUPPLIER_0',
            location: 'Shanghai'
        
        }]   
        const medicationB = [{
            docType: 'medication',
            manufacturer: 'Manufacturer B',
            antiCounterfeitCode: 'Code445566',
            expiryDate: '2023-12-31',
            name: 'Medicine B',
            owner: 'SUPPLIER_1',
            location: 'Shanghai'

        },
        {
            docType: 'medication',
            manufacturer: 'Manufacturer B',
            antiCounterfeitCode: 'Code778899',
            expiryDate: '2024-05-01',
            name: 'Medicine B',
            owner: 'SUPPLIER_1',
            location: 'Shanghai'
        }]
        const medicationC = [{
            docType: 'medication',
            manufacturer: 'Manufacturer C',
            antiCounterfeitCode: 'Code123123',
            expiryDate: '2023-12-31',
            name: 'Medicine C',
            owner: 'SUPPLIER_2',
            location: 'Shanghai'
        }]
        
        

        await ctx.stub.putState('Medicine A', Buffer.from(stringify(medicationA)));
        await ctx.stub.putState('Medicine B', Buffer.from(stringify(medicationB)));
        await ctx.stub.putState('Medicine C', Buffer.from(stringify(medicationC)));

        console.info('============= END : Initialize Ledger ===========');
            
       
    }

    
    
    /**
     * Initializes the anti-counterfeit code pool with the given length and seed string.
     * @param {Context} ctx The transaction context.
     * @param {number} len The length of the anti-counterfeit code pool.
     * @param {string} seedstr The seed string used to generate the anti-counterfeit codes.
     * @returns {Promise<void>}
     */
    async initializeAntiCounterfeitCodePool(ctx, len, seedstr) {
        const poolSize = len; // Set the pool size as required
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let antiCounterfeitCodePool = [];
        let length = 10;
        
        let hash = crypto.createHash('sha256').update(seedstr).digest('hex');
        // Converts the first 8 characters (hexadecimal) of the hash to an integer
        let seed = parseInt(hash.substring(0, 8), 16);
        
        
        // Initialize the PRNG with a seed
        let random = lcg(seed);
    
        for (let i = 0; i < poolSize; i++) {
            let result = '';
            for (let j = 0; j < length; j++) {
                result += characters.charAt(random() % characters.length);
            }
            antiCounterfeitCodePool.push(result);
        }
        
        await ctx.stub.putState('ANTI-COUNTERFEIT-CODE-POOL', Buffer.from(JSON.stringify(antiCounterfeitCodePool)));
        console.info('Anti-counterfeit code pool initialized.');
    }
    
    
    /**
     * Generates a specified number of unique anti-counterfeit codes from the anti-counterfeit code pool.
     * @param {Context} ctx - The transaction context object.
     * @param {number} quantity - The number of anti-counterfeit codes to generate.
     * @returns {Promise<string[]>} - An array of unique anti-counterfeit codes.
     * @throws Will throw an error if the anti-counterfeit code pool is empty.
     */
    async generateUniqueAntiCounterfeitCode(ctx,quantity) {
        let antiCounterfeitCodePoolAsBytes = await ctx.stub.getState('ANTI-COUNTERFEIT-CODE-POOL');
        let antiCounterfeitCodePool = JSON.parse(antiCounterfeitCodePoolAsBytes.toString());
        
        if (antiCounterfeitCodePool.length === 0) {
            throw new Error('The anti-counterfeit code pool is empty. Please initialize it.');
        }
        let Codes = [];
        // Get a specific number of security codes from the pool
        for (let i = 0; i < quantity; i++) {
            let antiCounterfeitCode = antiCounterfeitCodePool.pop();
            Codes.push(antiCounterfeitCode);
        }
        
        // update the pool to the world state
        await ctx.stub.putState('ANTI-COUNTERFEIT-CODE-POOL', Buffer.from(JSON.stringify(antiCounterfeitCodePool)));
        
        return Codes;

    }
    

    
    /**
     * Queries a transaction by its ID.
     * @param {Context} ctx The transaction context.
     * @param {string} transactionId The ID of the transaction to query.
     * @returns {Promise<object>} The transaction object.
     * @throws {Error} If the client identity is not from HospitalMSP or PatientMSP, or if the transaction does not exist.
     */
    async queryTransactionById(ctx, transactionId) {
        if (ctx.clientIdentity.getMSPID() !== 'HospitalMSP' && ctx.clientIdentity.getMSPID() !== 'PatientMSP') {
            throw new Error('Only a hospital or a patient can query a transaction.');
        }
    
        const transactionAsBytes = await ctx.stub.getState('TRANSACTION_' + transactionId);
        if (!transactionAsBytes || transactionAsBytes.length === 0) {
            throw new Error(`Transaction with ID ${transactionId} does not exist.`);
        }
        return JSON.parse(transactionAsBytes.toString());
    }
    

    /**
     * Queries an order by its ID.
     * @param {Context} ctx The transaction context.
     * @param {string} orderId The ID of the order to query.
     * @returns {Promise<Object>} The order object.
     * @throws {Error} If the client identity is not from HospitalMSP or SupplierMSP, or if the order does not exist.
     */
    async queryOrderById(ctx, orderId) {
        if (ctx.clientIdentity.getMSPID() !== 'HospitalMSP' && ctx.clientIdentity.getMSPID() !== 'SupplierMSP') {
            throw new Error('Only a hospital or a supplier can query an order.');
        }
    
        const orderAsBytes = await ctx.stub.getState('ORDER_' + orderId);
        if (!orderAsBytes || orderAsBytes.length === 0) {
            throw new Error(`Order with ID ${orderId} does not exist.`);
        }
        return JSON.parse(orderAsBytes.toString());
    }
    
    /**
     * Queries the blockchain for a medication with the given name.
     * @param {Context} ctx The transaction context.
     * @param {string} med_name The name of the medication to query.
     * @returns {Promise<Object>} The medication object.
     * @throws {Error} If the caller is not a supplier or hospital, or if the medication does not exist.
     */
    async queryMedicationByName(ctx, med_name) {
        const medicationAsBytes = await ctx.stub.getState(med_name);
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId === 'PatientMSP') {
            throw new Error('Only supplier and hospital can query.');
        }
        if (!medicationAsBytes || medicationAsBytes.length === 0) {
            throw new Error(`Medication with name ${med_name} does not exist.`);
        }
        let medication = JSON.parse(medicationAsBytes.toString());
        return medication;
    }

    /**
     * Creates a medication and stores it in the ledger. Only a supplier can create a medication.
     * @param {Context} ctx The transaction context
     * @param {string} manufacturer The name of the medication manufacturer
     * @param {string} expiryDate The expiry date of the medication
     * @param {string} med_name The name of the medication
     * @param {string} quantity The quantity of the medication to create
     * @param {string} supplierId The ID of the supplier creating the medication
     * @param {string} location The location of the supplier creating the medication
     * @returns {string} A message indicating that the medication was created
     */
    async SupplierCreateMedication(ctx, manufacturer, expiryDate, med_name, quantity, supplierId,location) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'SupplierMSP') {
            throw new Error('Only a supplier can create a medication.');
        }
        
        const medicationAsBytes = await ctx.stub.getState(med_name);
        let antiCounterfeitCodes = await this.generateUniqueAntiCounterfeitCode(ctx,quantity);


        if (!medicationAsBytes || medicationAsBytes.length === 0) {
            let intQuantity = parseInt(quantity, 10);
            let create_medications = [];
            for (let i = 0; i < intQuantity; i++) {
                
                create_medications.push(createMedication(manufacturer, expiryDate, med_name, antiCounterfeitCodes[i],supplierId,location));
            }
            await ctx.stub.putState(med_name, Buffer.from(JSON.stringify(create_medications)));
        }else{
            let medications = JSON.parse(medicationAsBytes.toString());
            let intQuantity = parseInt(quantity, 10); // Convert the quantity to an integer
            for (let i = 0; i < intQuantity; i++) {
                
                medications.push(createMedication(manufacturer, expiryDate, med_name, antiCounterfeitCodes[i],supplierId,location));
            }
            await ctx.stub.putState(med_name, Buffer.from(JSON.stringify(medications)));
        }
        

        console.info('============= END : Create Medication ===========');
        return 'Medication created';
    }
    


    /**
     * Transfers a specified quantity of medication from a supplier to a hospital.
     * @param {Context} ctx - The transaction context object.
     * @param {string} hospitalId - The ID of the hospital to transfer the medication to.
     * @param {string} supplierId - The ID of the supplier who owns the medication.
     * @param {string} med_name - The name of the medication to transfer.
     * @param {string} quantity - The quantity of medication to transfer.
     * @param {string} time - The time of the transaction.
     * @param {string} location - The location of the transaction.
     * @returns {string} - The ID of the order created for the transaction.
     * @throws Will throw an error if the client identity is not a supplier or if the medication does not exist or if there is not enough stock in the supplier inventory.
     */
    async transferMedicationToHospital(ctx,hospitalId,supplierId, med_name, quantity,time,location) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'SupplierMSP') {
            throw new Error('Only a supplier can initiate a transaction.');
        }
    
        const medicationAsBytes = await ctx.stub.getState(med_name);
        if (!medicationAsBytes || medicationAsBytes.length === 0) {
            throw new Error(`Medication ${med_name} does not exist.`);
        }
        let medications = JSON.parse(medicationAsBytes.toString());
        
        let intQuantity = parseInt(quantity, 10);
        // Filtering those owned by the supplier
        const ownedBySupplier = medications.filter(med => med.owner === supplierId);
        if (ownedBySupplier.length < intQuantity) {
            throw new Error('Not enough stock in supplier inventory.');
        }
        let loc = ""
        // Transfer ownership of the specified quantity of medications to the hospital
        for (let i = 0; i < intQuantity; i++) {
            // Obtain the ID of the drug owned by the supplier
            const antiCounterfeitCode = ownedBySupplier[i].antiCounterfeitCode;
            // Locate the appropriate medications in the medications array and update them
            const medicationToUpdate = medications.find(med => med.antiCounterfeitCode === antiCounterfeitCode);
            if (medicationToUpdate) {
                medicationToUpdate.owner = hospitalId;
                loc = medicationToUpdate.location
                medicationToUpdate.location = medicationToUpdate.location + " -> " + location;
            }
        }
        loc = loc + " -> " + location;
        const order = createOrder(hospitalId, supplierId,med_name, quantity, "Done",time,loc);
        await ctx.stub.putState('ORDER_' + ctx.stub.getTxID(), Buffer.from(JSON.stringify(order)));
        await ctx.stub.putState(med_name, Buffer.from(JSON.stringify(medications)));
        console.info('============= END : Transfer Medication ===========');
        return 'ORDER_' + ctx.stub.getTxID() + ' created';
    }
    


    /**
     * Transfers ownership of medication from a hospital to a patient and reduces the quantity of the medication in the hospital inventory.
     * Creates a transaction for the sale.
     * @param {Context} ctx - The transaction context object.
     * @param {string} time - The timestamp of the transaction.
     * @param {string} patientId - The ID of the patient who is buying the medication.
     * @param {string} hospitalId - The ID of the hospital that is selling the medication.
     * @param {string} med_name - The name of the medication being sold.
     * @param {string} quantity - The quantity of the medication being sold.
     * @param {string} location - The location of the patient who is buying the medication.
     * @returns {string} - The ID of the transaction that was created.
     * @throws Will throw an error if the client identity is not a hospital or patient, if the medication does not exist, or if there is not enough stock in the hospital inventory.
     */
    async sellMedicationToPatient(ctx, time, patientId,hospitalId, med_name, quantity,location) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'HospitalMSP' && mspId !== 'PatientMSP') {
            throw new Error('Only a hospital or Patient can sell create an transaction.');
        }
    
        const medicationAsBytes = await ctx.stub.getState(med_name);
        if (!medicationAsBytes || medicationAsBytes.length === 0) {
            throw new Error(`Medication with ID ${med_name} does not exist.`);
        }
        let medications = JSON.parse(medicationAsBytes.toString());
        let intQuantity = parseInt(quantity, 10);

        const ownedByHospital = medications.filter(med => med.owner === hospitalId);
        if (ownedByHospital.length < intQuantity) {
            throw new Error('Not enough stock in hospital inventory.');
        }
        let loc = ""
        // Transfer ownership and reduce the quantity of the medication in the hospital
        for (let i = 0; i < intQuantity; i++) {
            // get the antiCounterfeitCode of the medication owned by the hospital
            const antiCounterfeitCode = ownedByHospital[i].antiCounterfeitCode;
            
            const medicationToUpdate = medications.find(med => med.antiCounterfeitCode === antiCounterfeitCode);
            if (medicationToUpdate) {
                medicationToUpdate.owner = patientId;
                loc = medicationToUpdate.location
                medicationToUpdate.location = medicationToUpdate.location + " -> " + location;
            }
        }
        loc = loc + " -> " + location;
        // Create a transaction for the sale
        const transaction = createTransaction(time,med_name, patientId, hospitalId, quantity,loc);
        await ctx.stub.putState('TRANSACTION_' + ctx.stub.getTxID(), Buffer.from(JSON.stringify(transaction)));
        await ctx.stub.putState(med_name, Buffer.from(JSON.stringify(medications)));
        console.info('============= END : Sell Medication ===========');
        return 'TRANSACTION_' + ctx.stub.getTxID()+ ' created';
    }
    
    
   

    /**
     * Verifies the authenticity of a medication using its anti-counterfeit code.
     * @param {Context} ctx - The transaction context object
     * @param {string} med_name - The name of the medication to verify
     * @param {string} antiCounterfeitCode - The anti-counterfeit code of the medication to verify
     * @returns {Promise<Object>} The medication object if it is authentic
     * @throws Will throw an error if the medication does not exist or if the anti-counterfeit code is invalid
     */
    async verifyAuthenticityByAntiCounterfeitCode(ctx, med_name,antiCounterfeitCode) {
        
        const medicationAsBytes = await ctx.stub.getState(med_name);
        if (!medicationAsBytes || medicationAsBytes.length === 0) {
            throw new Error(`Medication with name ${med_name} does not exist.`);
        }
        let medications = JSON.parse(medicationAsBytes.toString());

        const medication = medications.filter(med => med.antiCounterfeitCode === antiCounterfeitCode);
        if (medication.length === 0) {
            throw new Error(`No medication found with anti-counterfeit code ${antiCounterfeitCode}. The medication might be counterfeit.`);
        }
        console.info('============= Verify Authenticity ===========');
        return medication[0];
    }
        

    
    /**
     * Retrieves all assets stored in the ledger. [JUST USE FOR TEST!!]
     * @param {Context} ctx The transaction context.
     * @returns {Promise<string>} A JSON string representing all assets and their corresponding keys.
     */
    async getAllAssets(ctx) {
        
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const keyValue = result.value;
            const strValue = Buffer.from(keyValue.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            allResults.push({ Key: keyValue.key, Record: record });
            result = await iterator.next();
        }
    
        return JSON.stringify(allResults);
    }


    
    /**
     * Creates an order from a hospital.
     * @param {Context} ctx - The transaction context object.
     * @param {string} hospitalId - The ID of the hospital creating the order.
     * @param {string} supplierId - The ID of the supplier fulfilling the order.
     * @param {string} med_name - The name of the medication being ordered.
     * @param {number} quantity - The quantity of the medication being ordered.
     * @param {string} time - The time at which the order is being created.
     * @returns {string} - The ID of the created order.
     * @throws {Error} - If the client identity is not from a hospital.
     */
    async createOrderfromHospital(ctx, hospitalId,supplierId, med_name, quantity, time) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'HospitalMSP') {
            throw new Error('Only a hospital can create an order.');
        }
        const order = createOrder(hospitalId, supplierId, med_name, quantity, "Pending",time);
        await ctx.stub.putState('ORDER_' + ctx.stub.getTxID(), Buffer.from(JSON.stringify(order)));
        console.info('============= END : Create Order ===========');
        return 'ORDER_' + ctx.stub.getTxID()+ ' created';
    }


    /**
     * Retrieves a list of orders for a specific supplier.
     * @param {Context} ctx - The transaction context object.
     * @param {string} supplierId - The ID of the supplier to retrieve orders for.
     * @returns {Promise<string>} A JSON string representing the list of orders for the specified supplier.
     * @throws Will throw an error if the client identity is not associated with the 'SupplierMSP' MSP.
     */
    async SupplierShowOrderlist(ctx, supplierId) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'SupplierMSP') {
            throw new Error('Only a supplier can query an order.');
        }
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const keyValue = result.value;
            const strValue = Buffer.from(keyValue.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            if(record.docType == "order" && record.supplierId == supplierId){
                allResults.push({ Key: keyValue.key, Record: record });
            }
            
            result = await iterator.next();
        }
    
        return JSON.stringify(allResults);
    }

    /**
     * Retrieves a list of orders associated with a specific hospital.
     * @param {Context} ctx - The transaction context object.
     * @param {string} hospitalId - The ID of the hospital to retrieve orders for.
     * @returns {Promise<string>} A JSON string representing the list of orders associated with the hospital.
     * @throws {Error} If the client identity is not associated with the "HospitalMSP" MSP.
     */
    async HospitalShowOrderlist(ctx,hospitalId){
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'HospitalMSP') {
            throw new Error('Only a hospital can query an order.');
        }
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const keyValue = result.value;
            const strValue = Buffer.from(keyValue.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
            } catch (err) {
                console.log(err);
                record = strValue;
            }
            // cause we use the leveldb, so we need to travel the whole world state and check the docType, which is one thing need to be improved
            if(record.docType == "order" && record.hospitalId == hospitalId){
                allResults.push({ Key: keyValue.key, Record: record });
            }
            
            result = await iterator.next();
        }
    
        return JSON.stringify(allResults);
    }

    /**
     * Retrieves all medication records owned by the specified supplier.
     * @param {Context} ctx - The transaction context object.
     * @param {string} supplierId - The ID of the supplier whose inventory is being queried.
     * @returns {Promise<string>} A JSON string representing an array of medication records owned by the specified supplier.
     * @throws Will throw an error if the client identity is not associated with the 'SupplierMSP' MSP.
     */
    async SupplierInventory(ctx, supplierId) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'SupplierMSP') {
            throw new Error('only supplier can query inventory.');
        }
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const keyValue = result.value;
            const strValue = Buffer.from(keyValue.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                // If record is not an array, it is converted to one here
                if (!Array.isArray(record)) {
                    record = [record];
                }
            } catch (err) {
                console.log(err);
                // If the parsing fails, skip this record and move on to the next one
                result = await iterator.next();
                continue;
            }
    
            for (let rec of record) {
                if (rec.docType === "medication" && rec.owner === supplierId) {
                    allResults.push({ Key: keyValue.key, Record: rec });
                }
                // If it is not a drug record, it is automatically skipped

            }
            result = await iterator.next();

        }
    
        //close iterator
        await iterator.close();
        return JSON.stringify(allResults);
    }
    

    /**
     * Retrieves all medication records owned by the specified hospital.
     * @param {Context} ctx - The transaction context object.
     * @param {string} hospitalId - The ID of the hospital to retrieve medication records for.
     * @returns {Promise<string>} A JSON string representing an array of medication records owned by the hospital.
     * @throws {Error} If the client identity is not associated with the 'HospitalMSP' MSP.
     */
    async HospitalInventory(ctx, hospitalId) {
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'HospitalMSP') {
            throw new Error('Only a hospital can query the Inventory.');
        }
        const allResults = [];
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
    
        while (!result.done) {
            const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
            let records;
            try {
                records = JSON.parse(strValue);
                // Ensure that records is always an array.
                if (!Array.isArray(records)) {
                    records = [records];
                }
            } catch (err) {
                console.log(err);
                continue; // Skip this record if there's an error parsing.
            }
    
            for (let record of records) {
                // Check if the record is a medication and if the owner is the hospitalId.
                if (record.docType === "medication" && record.owner === hospitalId) {
                    allResults.push({ Key: result.value.key, Record: record });
                }
                // If the record is not a medication, it will be skipped automatically.
            }
    
            result = await iterator.next();
        }
    
        await iterator.close(); // Don't forget to close the iterator.
        return JSON.stringify(allResults);
    }
    

    /**
     * Calculates the average sales volume of each drug for a given supplier.
     * Only the supplier can query demand forecasting.
     * @param {Context} ctx - The transaction context object.
     * @param {string} supplierId - The ID of the supplier to query.
     * @returns {Promise<string>} A JSON string representing the average sales volume of each drug.
     * @throws {Error} If the client identity is not that of a supplier.
     */
    async SupplierDemandForecasting(ctx, supplierId){
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'SupplierMSP') {
            throw new Error('only supplier can query demand forecasting.');
        }
        // Initializes the storage structure to store the total number of drugs sold and the number of orders
        const medicineSales = {};
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const keyValue = result.value;
            const strValue = Buffer.from(keyValue.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (!Array.isArray(record)) {
                    record = [record];
                }
            } catch (err) {
                console.log(err);
                result = await iterator.next();
                continue;
            }
    
            for (let rec of record) {
                if (rec.docType === "order" && rec.supplierId === supplierId) {
                    // Initializes the statistical data structure for the drug
                    if (!medicineSales[rec.medicine_name]) {
                        medicineSales[rec.medicine_name] = { totalQuantity: 0, orderCount: 0 };
                    }
                    // Add up the number of drugs sold and orders
                    medicineSales[rec.medicine_name].totalQuantity += parseInt(rec.quantity, 10);
                    medicineSales[rec.medicine_name].orderCount += 1;
                }
            }
    
            result = await iterator.next();
        }
        
        // Close the iterator
        await iterator.close();
        
        // Calculate the average sales volume of each drug and construct the return object
        const averageSales = {};
        for (const [medicine, data] of Object.entries(medicineSales)) {
            averageSales[medicine] = data.totalQuantity / data.orderCount;
        }
    
        return JSON.stringify(averageSales);
    }
    

    /**
     * Calculates the average purchases of each medication for a given hospital.
     * Only hospitals can query demand forecasting.
     * @param {Context} ctx - The transaction context object
     * @param {string} hospitalId - The ID of the hospital to query
     * @returns {string} - A JSON string representing the average purchases of each medication
     * @throws Will throw an error if the client identity is not associated with the HospitalMSP
     */
    async HospitalDemandForecasting(ctx, hospitalId){
        const mspId = ctx.clientIdentity.getMSPID();
        if (mspId !== 'HospitalMSP') {
            throw new Error('only hospital can query demand forecasting.');
        }
        
        const medicinePurchases = {};
        const iterator = await ctx.stub.getStateByRange('', '');
        let result = await iterator.next();
        while (!result.done) {
            const keyValue = result.value;
            const strValue = Buffer.from(keyValue.value.toString()).toString('utf8');
            let record;
            try {
                record = JSON.parse(strValue);
                if (!Array.isArray(record)) {
                    record = [record];
                }
            } catch (err) {
                console.log(err);
                result = await iterator.next();
                continue;
            }
    
            for (let rec of record) {
                if (rec.docType === "transaction" && rec.hospitalId === hospitalId) {
                    
                    if (!medicinePurchases[rec.medicationName]) {
                        medicinePurchases[rec.medicationName] = { totalQuantity: 0, transactionCount: 0 };
                    }
                    
                    medicinePurchases[rec.medicationName].totalQuantity += parseInt(rec.quantity, 10);
                    medicinePurchases[rec.medicationName].transactionCount += 1;
                }
            }
    
            result = await iterator.next();
        }
        
        
        await iterator.close();
        // Calculate the average purchases of each medication and construct the return object.
        // If we have more time, we can add machine learning algorithms to improve prediction accuracy
        const averagePurchases = {};
        for (const [medicine, data] of Object.entries(medicinePurchases)) {
            averagePurchases[medicine] = data.totalQuantity / data.transactionCount;
        }
    
        return JSON.stringify(averagePurchases);
    }
    

}

module.exports = MedicationContract;


