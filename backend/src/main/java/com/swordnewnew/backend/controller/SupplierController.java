package com.swordnewnew.backend.controller;

import java.util.concurrent.TimeUnit;

import org.hyperledger.fabric.client.Gateway;
import org.springframework.http.HttpStatus;
////////////////////////////////////////////////////////////
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

////////////////////////////////////////////////////////////
import com.swordnewnew.Response.AntiCounterfeitCodeResponse;
import com.swordnewnew.Response.CreateOrderResponse;
import com.swordnewnew.Response.CreateProductResponse;
import com.swordnewnew.Response.DemandForecastingResponse;
import com.swordnewnew.backend.gateway.HospitalGateway;
import com.swordnewnew.backend.gateway.SupplierGateway;
import com.swordnewnew.backend.gateway.SupplierGateway;
import com.swordnewnew.requestBody.CreateOrderRequest;
import com.swordnewnew.requestBody.CreateProductRequest;
import com.swordnewnew.requestBody.GenerateCodeRequest;

import io.grpc.ManagedChannel;

import java.util.concurrent.TimeUnit;
import org.hyperledger.fabric.client.Gateway;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.swordnewnew.Response.GenerateCodeResponse;
import com.swordnewnew.Response.InventoryResponse;
import com.swordnewnew.Response.OrderResponse;

@RestController
@CrossOrigin
@RequestMapping("/supplier")
public class SupplierController {

    @PostMapping("/createOrder")
    public CreateOrderResponse createOrderToHospital(@RequestBody CreateOrderRequest request) throws Exception {
        var channel = SupplierGateway.newGrpcConnection();
        var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity()).signer(SupplierGateway.newSigner())
                .connection(channel)
                // Default timeouts for different gRPC calls
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        CreateOrderResponse orderList = null;
        try (var gateway = builder.connect()) {
            orderList = new CreateOrderResponse(true,
                    new SupplierGateway(gateway).transferMedicationToHospital(request.getHospitalId(),
                            request.getSupplierId(),
                            request.getMedName(), request.getQuantity(), request.getTime(), request.getLocation()));
        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
        return orderList;
    }

    @PostMapping("/createProduct")
    public CreateProductResponse createProduct(@RequestBody CreateProductRequest request) throws Exception {
        var channel = SupplierGateway.newGrpcConnection();
        var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity()).signer(SupplierGateway.newSigner())
                .connection(channel)
                // Default timeouts for different gRPC calls
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        CreateProductResponse product = null;
        try (var gateway = builder.connect()) {
            product = new CreateProductResponse(true, new SupplierGateway(gateway).createProduct(
                    request.getmanufacturer(), request.getExpiryDate(), request.getmed_name(), request.getQuantity(),
                    request.getSupplierId(), request.getlocation()));
        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
        return product;
    }

    @PostMapping("/generateCode")
    public GenerateCodeResponse generateCode(@RequestBody GenerateCodeRequest request) throws Exception {
        var channel = SupplierGateway.newGrpcConnection();
        var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity()).signer(SupplierGateway.newSigner())
                .connection(channel)
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        String[] codes;
        try (var gateway = builder.connect()) {
            SupplierGateway supplierGateway = new SupplierGateway(gateway);
            codes = supplierGateway.generateAntiCounterfeitCode(request.getQuantity(), request.getSeed());
        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }

        return new GenerateCodeResponse(true, String.join(",", codes));
    }

    @GetMapping("/getDemandOrders")
    public ResponseEntity<OrderResponse> getDemandOrders(@RequestParam("supplierId") String supplierId)
            throws Exception {
        var channel = SupplierGateway.newGrpcConnection();

        var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity())
                .signer(SupplierGateway.newSigner()).connection(channel)
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        OrderResponse orderResponse;

        try (var gateway = builder.connect()) {
            String ordersJson = new SupplierGateway(gateway).SupplierShowOrderlist(supplierId);
            if (ordersJson != null && !ordersJson.isEmpty()) {
                orderResponse = new OrderResponse(true, ordersJson);
                return ResponseEntity.ok(orderResponse);
            } else {
                orderResponse = new OrderResponse(false, "No orders found for this supplier ID.");
                return ResponseEntity.ok(orderResponse);
            }
        } catch (Exception e) {
            orderResponse = new OrderResponse(false, "Error retrieving orders: " + e.getMessage());
            return ResponseEntity.internalServerError().body(orderResponse);
        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
    }

    @GetMapping("/supplierinventory")
    public ResponseEntity<InventoryResponse> checkSupplierInventory(@RequestParam("supplierId") String supplierId) throws Exception {
        var channel = SupplierGateway.newGrpcConnection();

        var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity())
                .signer(SupplierGateway.newSigner()).connection(channel)
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        InventoryResponse inventoryResponse;

        try (var gateway = builder.connect()) {
            String ordersJson = new SupplierGateway(gateway).CheckSupplierInventory(supplierId);
            if (ordersJson != null && !ordersJson.isEmpty()) {
                inventoryResponse = new InventoryResponse(true, ordersJson);
                return ResponseEntity.ok(inventoryResponse);
            } else {
                inventoryResponse = new InventoryResponse(false, "No orders found for this supplier ID.");
                return ResponseEntity.ok(inventoryResponse);
            }
        } catch (Exception e) {
            inventoryResponse = new InventoryResponse(false, "Error retrieving orders: " + e.getMessage());
            return ResponseEntity.internalServerError().body(inventoryResponse);
        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
    }

    @GetMapping("/supplierdemandforecasting")
    public DemandForecastingResponse DemandForecasting(@RequestParam("supplierId") String supplierId) throws Exception {
        var channel = SupplierGateway.newGrpcConnection();

        var builder = Gateway.newInstance().identity(SupplierGateway.newIdentity()).signer(SupplierGateway.newSigner())
                .connection(channel)
                // Default timeouts for different gRPC calls
                .evaluateOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .endorseOptions(options -> options.withDeadlineAfter(15, TimeUnit.SECONDS))
                .submitOptions(options -> options.withDeadlineAfter(5, TimeUnit.SECONDS))
                .commitStatusOptions(options -> options.withDeadlineAfter(1, TimeUnit.MINUTES));

        DemandForecastingResponse result = null;
        try (var gateway = builder.connect()) {
            result = new DemandForecastingResponse(true,
                    new SupplierGateway(gateway).SupplierDemandForecasting(supplierId));
        } finally {
            channel.shutdownNow().awaitTermination(5, TimeUnit.SECONDS);
        }
        // return all orders
        return result;
    }

}