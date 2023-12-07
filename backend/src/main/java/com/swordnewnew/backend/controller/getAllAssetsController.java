package com.swordnewnew.backend.controller;
import java.io.IOException;
import java.util.concurrent.TimeUnit;

import org.hyperledger.fabric.client.Gateway;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swordnewnew.backend.gateway.HospitalGateway;

import java.security.cert.CertificateException;
import java.security.InvalidKeyException;
import org.hyperledger.fabric.client.GatewayException;
import org.hyperledger.fabric.client.SubmitException;

@RestController
@CrossOrigin
@RequestMapping("/api/assets") 
public class getAllAssetsController {

    @GetMapping("/all")
    public String all() throws Exception{
        var channel = HospitalGateway.newGrpcConnection();

		var builder = Gateway.newInstance().identity(HospitalGateway.newIdentity()).signer(HospitalGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        String result = "";
		try (var gateway = builder.connect()) {
			result = new HospitalGateway(gateway).getAllAssets();
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
        //return the result
        return result;
    }
}