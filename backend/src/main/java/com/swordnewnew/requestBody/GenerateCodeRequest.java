package com.swordnewnew.requestBody;

public class GenerateCodeRequest {
    private String quantity;
    private String seed;

    public GenerateCodeRequest(String quantity, String seed) {
        this.quantity = quantity;
        this.seed = seed;
    }

    public String getQuantity() {
        return quantity;
    }

    public String getSeed() {
        return seed;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public void setSeed(String seed) {
        this.seed = seed;
    }
    
}
