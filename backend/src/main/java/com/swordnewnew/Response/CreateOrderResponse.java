package com.swordnewnew.Response;

public class CreateOrderResponse {
    private boolean success;
    private String data;

    public CreateOrderResponse(boolean success, String data) {
        this.success = success;
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getData() {
        return data;
    }
}
