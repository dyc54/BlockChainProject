package com.swordnewnew.backend.gateway;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;
import io.grpc.Grpc;
import io.grpc.ManagedChannel;
import io.grpc.TlsChannelCredentials;
import org.hyperledger.fabric.client.CommitException;
import org.hyperledger.fabric.client.CommitStatusException;
import org.hyperledger.fabric.client.Contract;
import org.hyperledger.fabric.client.EndorseException;
import org.hyperledger.fabric.client.Gateway;
import org.hyperledger.fabric.client.GatewayException;
import org.hyperledger.fabric.client.SubmitException;
import org.hyperledger.fabric.client.identity.Identities;
import org.hyperledger.fabric.client.identity.Identity;
import org.hyperledger.fabric.client.identity.Signer;
import org.hyperledger.fabric.client.identity.Signers;
import org.hyperledger.fabric.client.identity.X509Identity;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.cert.CertificateException;
import java.time.Instant;
import java.util.concurrent.TimeUnit;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

public final class SupplierGateway {
	private static final String MSP_ID = System.getenv().getOrDefault("MSP_ID", "SupplierMSP");
    private static final String CHANNEL_NAME = System.getenv().getOrDefault("CHANNEL_NAME", "mychannel");
    private static final String CHAINCODE_NAME = System.getenv().getOrDefault("CHAINCODE_NAME", "mychaincode8");

    // Path to crypto materials.

    private static final Path CRYPTO_PATH = Paths.get(System.getenv().getOrDefault("CRYPTO_PATH", "../Blockchain/crypto-config/peerOrganizations/supplier.example.com"));

    
    // Path to user private key directory.
    private static final Path KEY_DIR_PATH = CRYPTO_PATH.resolve(Paths.get("users", "User1@supplier.example.com", "msp", "keystore"));
    
    // Path to user certificate.
    private static final Path CERT_PATH = CRYPTO_PATH.resolve(Paths.get("users", "User1@supplier.example.com", "msp", "signcerts", "User1@supplier.example.com-cert.pem"));
    
    // Path to peer tls certificate.
    private static final Path TLS_CERT_PATH = CRYPTO_PATH.resolve(Paths.get("peers", "peer0.supplier.example.com", "tls", "ca.crt"));
    
    // Gateway peer end point.
    private static final String PEER_ENDPOINT = System.getenv().getOrDefault("PEER_ENDPOINT", "localhost:7051");
    private static final String OVERRIDE_AUTH = System.getenv().getOrDefault("PEER_HOST_ALIAS", "peer0.supplier.example.com");

    private final Contract contract;
    private final String assetId = "asset" + Instant.now().toEpochMilli();
    private final Gson gson = new GsonBuilder().setPrettyPrinting().create();

	public static ManagedChannel newGrpcConnection() throws IOException {
		var credentials = TlsChannelCredentials.newBuilder()
				.trustManager(TLS_CERT_PATH.toFile())
				.build();
		return Grpc.newChannelBuilder(PEER_ENDPOINT, credentials)
				.overrideAuthority(OVERRIDE_AUTH)
				.build();
	}

	public static Identity newIdentity() throws IOException, CertificateException {
		var certReader = Files.newBufferedReader(CERT_PATH);
		var certificate = Identities.readX509Certificate(certReader);

		return new X509Identity(MSP_ID, certificate);
	}

	public static Signer newSigner() throws IOException, InvalidKeyException {
		var keyReader = Files.newBufferedReader(getPrivateKeyPath());
		var privateKey = Identities.readPrivateKey(keyReader);

		return Signers.newPrivateKeySigner(privateKey);
	}

	private static Path getPrivateKeyPath() throws IOException {
		try (var keyFiles = Files.list(KEY_DIR_PATH)) {
			return keyFiles.findFirst().orElseThrow();
		}
	}

	public SupplierGateway(final Gateway gateway) {
		// Get a network instance representing the channel where the smart contract is
		// deployed.
		var network = gateway.getNetwork(CHANNEL_NAME);

		// Get the smart contract from the network.
		contract = network.getContract(CHAINCODE_NAME);
	}

	
	/**
	 * This type of transaction would typically only be run once by an application
	 * the first time it was started after its initial deployment. A new version of
	 * the chaincode deployed later would likely not need to run an "init" function.
	 */
	public void initLedger() throws EndorseException, SubmitException, CommitStatusException, CommitException {
		System.out.println("\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger");

		contract.submitTransaction("InitLedger");

		System.out.println("*** Transaction committed successfully");
	}

    public void initializeAntiCounterfeitCodePool() throws EndorseException, SubmitException, CommitStatusException, CommitException {
        System.out.println("\n--> Submit Transaction: InitializeAntiCounterfeitCodePool, function creates the initial set of antiCounterfeitCodePool on the ledger");
        contract.submitTransaction("initializeAntiCounterfeitCodePool");
        System.out.println("*** Transaction committed successfully");
    }

	/**
	 * Evaluate a transaction to query ledger state.
	 */
	public String getAllAssets() throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger");

		var result = contract.evaluateTransaction("getAllAssets");
		
		System.out.println("*** Result: " + prettyJson(result));
		return prettyJson(result);
	}

	public String prettyJson(final byte[] json) {
		return prettyJson(new String(json, StandardCharsets.UTF_8));
	}

	public String prettyJson(final String json) {
		var parsedJson = JsonParser.parseString(json);
		return gson.toJson(parsedJson);
	}

	
    public String transferMedicationToHospital(String hospitalId, String supplierId, String medName, String quantity, String time, String location) throws Exception {
        System.out.println("\n--> Submit Transaction: TransferMedicationToHospital, function transfer medication to hospital");
		var MedicationId = contract.submitTransaction("transferMedicationToHospital", hospitalId, supplierId, medName, quantity, time, location);
		var result = new String(MedicationId, StandardCharsets.UTF_8);
		System.out.println("*** Transaction committed successfully");
		return result;
    }

	public String CheckSupplierInventory(String supplierId) throws Exception {
        System.out.println("\n--> Submit Transaction: TransferMedicationToHospital, function transfer medication to hospital");
		var inventory = contract.submitTransaction("SupplierInventory", supplierId);
		var result = new String(inventory, StandardCharsets.UTF_8);
		System.out.println("*** Transaction committed successfully");
		return result;
    }

	public String SupplierDemandForecasting(String supplierId) throws Exception {
        System.out.println("\n--> Submit Transaction: TransferMedicationToHospital, function transfer medication to hospital");
		var number = contract.submitTransaction("SupplierDemandForecasting", supplierId);
		var result = new String(number, StandardCharsets.UTF_8);
		System.out.println("*** Transaction committed successfully");
		return result;
    }

	
	
	public String verifyAuthenticityByAntiCounterfeitCode(String medName, String antiCounterfeitCode) throws Exception {
		System.out.println("\n--> Evaluate Transaction: VerifyAuthenticityByAntiCounterfeitCode");
	
		var result = contract.evaluateTransaction("verifyAuthenticityByAntiCounterfeitCode", medName, antiCounterfeitCode);
		var medication = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Medication verified: " + medication);
	
		return medication;
	}
	

	public String queryTransactionById(String transactionId) throws Exception {
		System.out.println("\n--> Evaluate Transaction: QueryTransactionById");
	
		var result = contract.evaluateTransaction("queryTransactionById", transactionId);
		var transaction = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Transaction details: " + transaction);
	
		return transaction;
	}
	
	public String queryOrderById(String orderId) throws Exception {
		System.out.println("\n--> Evaluate Transaction: QueryOrderById");
	
		var result = contract.evaluateTransaction("queryOrderById", orderId);
		var order = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Order details: " + order);
	
		return order;
	}
	

	public String createProduct(String manufacturer, String expiryDate, String med_name, String quantity, String supplierId, String location) throws Exception {
		System.out.println("\n--> Submit Transaction: createProduct");
		var result = contract.submitTransaction("SupplierCreateMedication", manufacturer, expiryDate, med_name, quantity, supplierId, location);
		var productId = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Transaction committed successfully. Product ID: " + productId);
	
		return productId;
	}
	


	public String queryMedicationByName(String medName) throws Exception {
		System.out.println("\n--> QueryMedicationByName");
	
		var result = contract.evaluateTransaction("queryMedicationByName", medName);
		var medication = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Medication details: " + medication);
	
		return medication;
	}

	public String SupplierShowOrderlist(String supplierID) throws Exception {
        System.out.println("\n--> SupplierShowOrderlist");
    
        var result = contract.evaluateTransaction("SupplierShowOrderlist", supplierID);
        var orderlist = new String(result, StandardCharsets.UTF_8);
        System.out.println("*** Orderlist details: " + orderlist);
    
        return orderlist;
	}
	
	public String[] generateAntiCounterfeitCode(String quantity, String seed) throws Exception {
		// Assuming the chain code function follows med_ Name generates an anti-counterfeiting code
		// and returns a separate anti-counterfeiting code or a set of anti-counterfeiting codes
		byte[] result = contract.submitTransaction("initializeAntiCounterfeitCodePool", quantity, seed);
		// Parse the returned result, assuming the result is a comma separated string
		return new String(result, StandardCharsets.UTF_8).split(",");
	}



}