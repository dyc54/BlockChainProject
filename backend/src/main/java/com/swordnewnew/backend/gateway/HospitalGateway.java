package com.swordnewnew.backend.gateway;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.InvalidKeyException;
import java.security.cert.CertificateException;
import java.time.Instant;

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

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonParser;

import io.grpc.Grpc;
import io.grpc.ManagedChannel;
import io.grpc.TlsChannelCredentials;

public final class HospitalGateway {
	private static final String MSP_ID = System.getenv().getOrDefault("MSP_ID", "HospitalMSP");
    private static final String CHANNEL_NAME = System.getenv().getOrDefault("CHANNEL_NAME", "mychannel");
    private static final String CHAINCODE_NAME = System.getenv().getOrDefault("CHAINCODE_NAME", "mychaincode8");

    // Path to crypto materials.
	

    private static final Path CRYPTO_PATH = Paths.get(System.getenv().getOrDefault("CRYPTO_PATH", "../Blockchain/crypto-config/peerOrganizations/hospital.example.com"));

    // Path to user private key directory.
    private static final Path KEY_DIR_PATH = CRYPTO_PATH.resolve(Paths.get("users", "User1@hospital.example.com", "msp", "keystore"));
    
    // Path to user certificate.
    private static final Path CERT_PATH = CRYPTO_PATH.resolve(Paths.get("users", "User1@hospital.example.com", "msp", "signcerts", "User1@hospital.example.com-cert.pem"));
    
    // Path to peer tls certificate.
    private static final Path TLS_CERT_PATH = CRYPTO_PATH.resolve(Paths.get("peers", "peer0.hospital.example.com", "tls", "ca.crt"));
    
    // Gateway peer end point.
    private static final String PEER_ENDPOINT = System.getenv().getOrDefault("PEER_ENDPOINT", "localhost:9051");
    private static final String OVERRIDE_AUTH = System.getenv().getOrDefault("PEER_HOST_ALIAS", "peer0.hospital.example.com");

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

	public HospitalGateway(final Gateway gateway) {
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

	/**
	 * Evaluate a transaction to query ledger state.
	 */
	public String getAllAssets() throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger");

		var result = contract.evaluateTransaction("getAllAssets");
		
		System.out.println("*** Result: " + prettyJson(result));
		return prettyJson(result);
	}

	public String getOrder(String orderId) throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: GetOrder, function returns the order with the given orderId");

		var result = contract.evaluateTransaction("queryOrderById", orderId);
		
		System.out.println("*** Result: " + prettyJson(result));
		return prettyJson(result);
	}

	public String getTransaction(String transactionId) throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: GetTransaction, function returns the transaction with the given transactionId");

		var result = contract.evaluateTransaction("queryTransactionById", transactionId);
		
		System.out.println("*** Result: " + prettyJson(result));
		return prettyJson(result);
	}

	public String verifyAntiCounterFeitCode(String med_name, String anti_counterfeit_code) throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: VerifyAntiCounterFeitCode, function returns the transaction with the given transactionId");

		var result = contract.evaluateTransaction("verifyAntiCounterFeitCode", med_name, anti_counterfeit_code);
		
		System.out.println("*** Result: " + prettyJson(result));
		return prettyJson(result);
	}

	public String SellMedication(String time, String med_name, String quantity, String patientId, String hospitalId) throws GatewayException {
		System.out.println("\n--> Evaluate Transaction: SellMedication, function returns the transaction with the given transactionId");

		var result = contract.evaluateTransaction("SellMedication", time, med_name, quantity, patientId, hospitalId);
		
		System.out.println("*** Result: " + prettyJson(result));
		return prettyJson(result);
	}

	private String prettyJson(final byte[] json) {
		return prettyJson(new String(json, StandardCharsets.UTF_8));
	}

	private String prettyJson(final String json) {
		var parsedJson = JsonParser.parseString(json);
		return gson.toJson(parsedJson);
	}

	

	/**
	 * Submit transactions to sell medication to patient.
	 */
	public String sellMedicationToPatient(String time, String patientId, String hospitalId, String medName, String quantity, String location) throws EndorseException, SubmitException,
	CommitStatusException, CommitException {
		System.out.println("\n--> Submit Transaction: TransferMedicationToHospital, function transfer medication to hospital");
		var MedicationId = contract.submitTransaction("sellMedicationToPatient", time, patientId, hospitalId, medName, quantity, location);
		var result = new String(MedicationId, StandardCharsets.UTF_8);
		
		System.out.println("*** Successfully submitted transaction for selling medication");
		return result;
	}
	
	public String createOrderfromHospital(String hospitalId, String supplierId, String medName, String quantity, String time) throws Exception {

		System.out.println("\n--> Evaluate Transaction: createOrderfromHospital");

		var result = contract.submitTransaction("createOrderfromHospital", hospitalId, supplierId, medName, quantity, time);
		var orderId = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Transaction committed successfully. Order ID: " + orderId);
	
		return orderId;
	}

	public String CheckHospitalInventory(String hospitalId) throws Exception {
        System.out.println("\n--> Submit Transaction: TransferMedicationToHospital, function transfer medication to hospital");
		var inventory = contract.submitTransaction("HospitalInventory", hospitalId);
		var result = new String(inventory, StandardCharsets.UTF_8);
		System.out.println("*** Transaction committed successfully");
		return result;
    }

	public String HospitalDemandForecasting(String hospitalId) throws Exception {
        System.out.println("\n--> Submit Transaction: TransferMedicationToHospital, function transfer medication to hospital");
		var number = contract.submitTransaction("HospitalDemandForecasting", hospitalId);
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
	

	public String queryMedicationByName(String medName) throws Exception {
		System.out.println("\n--> QueryMedicationByName");
	
		var result = contract.evaluateTransaction("queryMedicationByName", medName);
		var medication = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Medication details: " + medication);
	
		return medication;
	}

	public String HospitalShowOrderlist(String HospitalID) throws Exception {
		System.out.println("\n--> HospitalShowOrderlist");
	
		var result = contract.evaluateTransaction("HospitalShowOrderlist",HospitalID);
		var orderlist = new String(result, StandardCharsets.UTF_8);
		System.out.println("*** Orderlist details: " + orderlist);
	
		return orderlist;
	}

}