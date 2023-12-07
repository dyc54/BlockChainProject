package com.swordnewnew.Response;

public class LoginResponse {
    private boolean success;
    private String message;
    private String userType;
    private String userId;

    public LoginResponse() {
    }

    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public void setUserId(String userId) {  // setUserId
        this.userId = userId;
    }

    public String getUserId() {  // getUserId
        return userId;
    }
}
