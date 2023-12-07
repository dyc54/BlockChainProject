package com.swordnewnew.requestBody;

public class sellMedicationRequest {
    private String med_name;
    private String quantity;
    private String time;
    private String patientId;
    private String hospitalId;
    private String location;

    public sellMedicationRequest(String med_name, String quantity, String time, String patientId, String hospitalId, String location) {
        this.med_name = med_name;
        this.quantity = quantity;
        this.time = time;
        this.patientId = patientId;
        this.hospitalId = hospitalId;
        this.location = location;
    }

    public String getMed_name() {
        return med_name;
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

    public String getLocation() {
        return location;
    }

    public void setMed_name(String med_name) {
        this.med_name = med_name;
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

    public void setLocation(String location) {
        this.location = location;
    }

}
