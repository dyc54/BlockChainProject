package com.swordnewnew.backend.controller;

// Importing necessary libraries and packages
import com.fasterxml.jackson.databind.ObjectMapper;
import com.swordnewnew.Response.LoginResponse;
import com.swordnewnew.Response.UserData;

import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// Annotating the class as a Rest Controller with Cross Origin support and mapping it to "/api" endpoint
@RestController
@CrossOrigin
@RequestMapping("/api")
public class LoginController {

    // Defining the path to the JSON file that stores user data
    private final String jsonFilePath = "src/main/data/user_data.json";

    // Mapping the login endpoint to a GET request, expecting email and password as request parameters
    @GetMapping("/login")
    public LoginResponse loginUser(@RequestParam String email, @RequestParam String password) {
        try {
            // Reading user data from the JSON file
            List<UserData> userDataList = readUserData();
            // Iterating through the list of users
            for (UserData userData : userDataList) {
                // Checking if the email and password match
                if (userData.getEmail().equals(email) && userData.getPassword().equals(password)) {
                    // Creating and populating a success response if credentials match
                    LoginResponse loginResponse = new LoginResponse();
                    loginResponse.setSuccess(true);
                    loginResponse.setMessage("Login successful");
                    loginResponse.setUserType(userData.getUserType());
                    loginResponse.setUserId(userData.getUserId());
                    return loginResponse;
                }
            }
        } catch (IOException e) {
            // Handling IOException that might occur while reading the file
            e.printStackTrace();
            // Creating and populating an error response in case of an exception
            LoginResponse errorResponse = new LoginResponse();
            errorResponse.setSuccess(false);
            errorResponse.setMessage("Login failed due to server error");
            return errorResponse;
        }

        // Creating and populating a failure response if credentials do not match
        LoginResponse failureResponse = new LoginResponse();
        failureResponse.setSuccess(false);
        failureResponse.setMessage("Invalid email or password");
        return failureResponse;
    }

    // Helper method to read user data from the JSON file
    private List<UserData> readUserData() throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        File file = new File(jsonFilePath);

        // Checking if the file exists, if not return an empty list
        if (!file.exists()) {
            return new ArrayList<>();
        }
        // Reading and returning user data from the file
        return objectMapper.readValue(file, objectMapper.getTypeFactory().constructCollectionType(List.class,
        UserData.class));
    }
}
