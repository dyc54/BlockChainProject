package com.swordnewnew.requestBody;

public class CreateProductRequest {

    private String manufacturer;
    private String expiryDate;
    private String med_name;
    private String quantity;
    private String supplierId;
    private String location;

    // Constructors, Getters, and Setters

    public CreateProductRequest() {
        // Default constructor
    }

    public String getmanufacturer() {
        return manufacturer;
    }

    public void setmanufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getSupplierId() {
        return supplierId;
    }

    public void setSupplierId(String supplierId) {
        this.supplierId = supplierId;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate= expiryDate;
    }

    public String getQuantity() {
        return quantity;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public String getmed_name() {
        return med_name;
    }

    public void setmed_name(String med_name) {
        this.med_name = med_name;
    }

    public String getlocation() {
        return location;
    }

    public void setlocation(String location) {
        this.location = location;
    }
}
