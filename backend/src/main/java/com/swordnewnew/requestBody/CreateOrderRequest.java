package com.swordnewnew.requestBody;

// Renamed class to follow Java naming conventions
public class CreateOrderRequest {
    private String hospitalId;
    private String supplierId;
    private String medName;
    private String time;
    private String quantity;
    private String location;

    public CreateOrderRequest() {
    }

    public CreateOrderRequest(String hospitalId, String supplierId, String medName, String quantity, String time) {
        this.hospitalId = hospitalId;
        this.supplierId = supplierId;
        this.medName = medName;
        this.quantity = quantity;
        this.time = time;
    }

    // Getter for hospitalId
    public String getHospitalId() {
        return hospitalId;
    }

    // Setter for hospitalId
    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    // Getter for supplierId
    public String getSupplierId() {
        return supplierId;
    }

    // Setter for supplierId
    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    // Getter for medName
    public String getMedName() {
        return medName;
    }

    // Setter for medName
    public void setMedName(String medName) {
        this.medName = medName;
    }

    // Getter for quantity
    public String getQuantity() {
        return quantity;
    }

    // Setter for quantity
    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    // Getter for time
    public String getTime() {
        return time;
    }

    // Setter for time
    public void setTime(String time) {
        this.time = time;
    }

    // Getter for location
    public String getLocation() {
        return location;
    }

    // Setter for location
    public void setLocation(String location) {
        this.location = location;
    }
}
