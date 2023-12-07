package com.swordnewnew.backend.controller;
import org.springframework.web.bind.annotation.*;

import com.swordnewnew.Response.AntiCounterfeitCodeResponse;
import com.swordnewnew.Response.OrderResponse;
import com.swordnewnew.backend.gateway.SupplierGateway;

import java.util.concurrent.TimeUnit;

import org.checkerframework.checker.units.qual.A;
import org.hyperledger.fabric.client.Gateway;
import org.springframework.http.ResponseEntity;

@RestController
@CrossOrigin
public class ViewOrderController {

    @GetMapping("/view_order")
    public OrderResponse viewOrder(@RequestParam("orderId") String orderId) throws Exception{
        var channel = SupplierGateway.newGrpcConnection();

		var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity()).signer(SupplierGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        OrderResponse result = null;
		try (var gateway = builder.connect()) {
			result = new OrderResponse(true, new SupplierGateway(gateway).queryOrderById(orderId));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
        //return the result
        return result;
    }

}