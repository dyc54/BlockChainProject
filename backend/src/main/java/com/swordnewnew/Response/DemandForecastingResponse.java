package com.swordnewnew.Response;

public class DemandForecastingResponse {
    private boolean success;
    private String demand;

    public DemandForecastingResponse(boolean success, String demand) {
        this.success = success;
        this.demand = demand;
    }

    public boolean isSuccess() {
        return success;
    }

    public String getDemand() {
        return demand;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public void setDemand(String demand) {
        this.demand = demand;
    }
}
