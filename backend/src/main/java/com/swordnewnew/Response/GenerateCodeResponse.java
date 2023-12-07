package com.swordnewnew.Response;


public class GenerateCodeResponse {
    private boolean success;
    private String antiCounterfeitCode;

    public GenerateCodeResponse(boolean success, String antiCounterfeitCode) {
        this.success = success;
        this.antiCounterfeitCode = antiCounterfeitCode;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getAntiCounterfeitCode() {
        return antiCounterfeitCode;
    }
}

