package com.swordnewnew.requestBody;

public class SellHosMedicationRequest {
    private String time;
    private String hospitalId;
    private String patientId;
    private String medName;
    private String quantity;
    private String location;

    public SellHosMedicationRequest(String time, String hospitalId, String patientId, String medName, String quantity) {
        this.time = time;
        this.hospitalId = hospitalId;
        this.patientId = patientId;
        this.medName = medName;
        this.quantity = quantity;
    }

    public String getMed_name() {
        return medName;
    }

    public String getQuantity() {
        return quantity;
    }

    public String getTime() {
        return time;
    }

    public String getPatientId() {
        return patientId;
    }

    public String getHospitalId() {
        return hospitalId;
    }

    public void setMed_name(String medName) {
        this.medName = medName;
    }

    public void setQuantity(String quantity) {
        this.quantity = quantity;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public void setHospitalId(String hospitalId) {
        this.hospitalId = hospitalId;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

}