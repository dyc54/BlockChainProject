package com.swordnewnew.backend.controller;
import org.springframework.web.bind.annotation.*;


import com.swordnewnew.Response.AntiCounterfeitCodeResponse;
import com.swordnewnew.Response.CreateOrderResponse;
import com.swordnewnew.Response.DemandForecastingResponse;
import com.swordnewnew.Response.InventoryResponse;
import com.swordnewnew.Response.OrderResponse;
import com.swordnewnew.Response.SellHosMedicationResponse;
import com.swordnewnew.backend.gateway.HospitalGateway;
import com.swordnewnew.backend.gateway.PatientGateway;
import com.swordnewnew.backend.gateway.SupplierGateway;
////
import com.swordnewnew.requestBody.CreateOrderRequest;
import com.swordnewnew.requestBody.SellHosMedicationRequest;

import java.util.concurrent.TimeUnit;

import org.hyperledger.fabric.client.Gateway;
import org.hyperledger.fabric.protos.peer.Transaction;

@RestController
@CrossOrigin
@RequestMapping("/hospital")
public class HospitalController {

    // create the order list
    @PostMapping("/createDemandOrder")
    public CreateOrderResponse createOrder(@RequestBody CreateOrderRequest request) throws Exception{
        var channel = HospitalGateway.newGrpcConnection();
        var builder = Gateway.newInstance().identity(HospitalGateway.newIdentity()).signer(HospitalGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));
        

		CreateOrderResponse orderList = null;
        try (var gateway = builder.connect()) {
			orderList = new CreateOrderResponse(true, new HospitalGateway(gateway).createOrderfromHospital(request.getHospitalId(), request.getSupplierId(),
			request.getMedName(), request.getQuantity(), request.getTime()));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
		return orderList;
    }

	@PostMapping("/sellMedToPatient")
    public SellHosMedicationResponse sellMedication(@RequestBody SellHosMedicationRequest request) throws Exception {

        var channel = HospitalGateway.newGrpcConnection();
        var builder = Gateway.newInstance().identity(HospitalGateway.newIdentity()).signer(HospitalGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));
        
        SellHosMedicationResponse transformId = null;
        try (var gateway = builder.connect()) {
			transformId = new SellHosMedicationResponse(true,
			new HospitalGateway(gateway).sellMedicationToPatient(request.getTime(),
			request.getPatientId(), request.getHospitalId(), request.getMed_name(), request.getQuantity(), request.getLocation()));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
        return transformId;
    }


    @GetMapping("/getDemandOrder")
    public OrderResponse viewOrder(@RequestParam("hospitalId") String hospitalId) throws Exception{
        var channel =  HospitalGateway.newGrpcConnection();

		var builder = Gateway.newInstance().identity( HospitalGateway.newIdentity()).signer(HospitalGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        OrderResponse orderList = null;
		try (var gateway = builder.connect()) {
			orderList = new OrderResponse(true, new HospitalGateway(gateway).HospitalShowOrderlist(hospitalId));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}

        //return all orders
        return orderList;
    }

	@GetMapping("/hospitalinventory")
    public InventoryResponse checkHospitalInventory(@RequestParam("hospitalId") String hospitalId) throws Exception{
        var channel =  HospitalGateway.newGrpcConnection();

		var builder = Gateway.newInstance().identity( HospitalGateway.newIdentity()).signer(HospitalGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        InventoryResponse List = null;
		try (var gateway = builder.connect()) {
			List = new InventoryResponse(true, new HospitalGateway(gateway).CheckHospitalInventory(hospitalId));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
        //return all orders
        return List;
    }

	@GetMapping("/hospitaldemandforecasting")
    public DemandForecastingResponse DemandForecasting(@RequestParam("hospitalId") String hospitalId) throws Exception{
        var channel =  HospitalGateway.newGrpcConnection();

		var builder = Gateway.newInstance().identity( HospitalGateway.newIdentity()).signer(HospitalGateway.newSigner()).connection(channel)
				// Default timeouts for different gRPC calls
				.evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
				.submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
				.commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        DemandForecastingResponse result = null;
		try (var gateway = builder.connect()) {
			result = new DemandForecastingResponse(true, new HospitalGateway(gateway).HospitalDemandForecasting(hospitalId));
		} finally {
			channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
		}
        //return all orders
        return result;
    }

}

