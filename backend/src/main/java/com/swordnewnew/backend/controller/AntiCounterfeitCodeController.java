package com.swordnewnew.backend.controller;

import java.util.concurrent.TimeUnit;

import org.hyperledger.fabric.client.Gateway;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.swordnewnew.backend.gateway.PatientGateway;
import com.swordnewnew.Response.AntiCounterfeitCodeResponse;
import com.swordnewnew.backend.gateway.PatientGateway;

@RestController
@CrossOrigin
public class AntiCounterfeitCodeController {
    
    @GetMapping("/verify_AntiCounterfeitCode")
    public AntiCounterfeitCodeResponse verifyAntiCounterfeitCode(@RequestParam("antiCounterfeitCode") String antiCounterfeitCode, @RequestParam("med_name") String med_name) throws Exception{
        var channel = PatientGateway.newGrpcConnection();

        var builder = Gateway.newInstance().identity(PatientGateway.newIdentity()).signer(PatientGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        AntiCounterfeitCodeResponse result = null;
        try (var gateway = builder.connect()) {
			result = new AntiCounterfeitCodeResponse(true, new PatientGateway(gateway).verifyAuthenticityByAntiCounterfeitCode(med_name, antiCounterfeitCode));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
        //return the result
        return result;

    }
}
