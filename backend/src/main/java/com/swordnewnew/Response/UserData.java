package com.swordnewnew.Response;

public class UserData {
    private String email;
    private String userType;
    private String password;  // add password
    private String userId;  // add userId

    public UserData() {
    }

    public UserData(String email, String userType, String password) {
        this.email = email;
        this.userType = userType;
        this.password = password;
        this.userId = email + "Id";
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserType() {
        return userType;
    }

    public void setUserType(String userType) {
        this.userType = userType;
    }

    public String getPassword() {  // getPassword
        return password;
    }

    public void setPassword(String password) {  // setPassword
        this.password = password;
    }

    public String getUserId() {  // getUserId
        return userId;
    }

    public void setUserId(String userId) {  // setUserId
        this.userId = userId;
    }
}
