package com.swordnewnew.Response;

public class AntiCounterfeitCodeResponse {
    private boolean success;
    private String data;

    public AntiCounterfeitCodeResponse(boolean success, String data) {
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