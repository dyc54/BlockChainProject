package com.swordnewnew.Response;

public class InventoryResponse {
    private boolean success;
    private String inventory;

    public InventoryResponse(boolean success, String inventory) {
        this.success = success;
        this.inventory = inventory;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getInventory() {
        return inventory;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setInventory(String inventory) {
        this.inventory = inventory;
    }

    
}
