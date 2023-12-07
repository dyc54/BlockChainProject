package com.swordnewnew.backend.controller;

// Importing necessary libraries and packages
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.swordnewnew.Response.ResetPasswordResponse;
import com.swordnewnew.Response.UserData;

// Annotating the class as a Rest Controller with Cross Origin support and mapping it to "/api" endpoint
@RestController
@CrossOrigin
@RequestMapping("/api")
public class ResetPasswordController {

    // Defining the path to the JSON file that stores user data
    private final String jsonFilePath = "src/main/data/user_data.json";

    // Mapping the forgetpassword endpoint to a PUT request, expecting a JSON body with user data
    @PutMapping("/forgetpassword")
    public ResponseEntity<ResetPasswordResponse> resetPassword(@RequestBody UserData request) {
        // Creating a response object to populate and return later
        ResetPasswordResponse response = new ResetPasswordResponse();
        try {
            // Reading user data from the JSON file
            List<UserData> userDataList = readUserData();
            boolean userFound = false;
            // Iterating through the list of users
            for (UserData userData : userDataList) {
                // Checking if the email in the request matches any user
                if (userData.getEmail().equals(request.getEmail())) {
                    // If match is found, update the password
                    userData.setPassword(request.getPassword());
                    userFound = true;
                    break;
                }
            }
            
            if (userFound) {
                // If user was found, write the updated data back to the JSON file
                writeUserData(userDataList);
                response.setSuccess(true);
                response.setMessage("Password reset successful");
                return ResponseEntity.ok(response);  // Returning a 200 OK response
            } else {
                // If no matching user was found, populate the response with an error message
                response.setSuccess(false);
                response.setMessage("User not found");
                return ResponseEntity.status(404).body(response);  // Returning a 404 Not Found response
            }
        } catch (IOException e) {
            // Handling IOException that might occur while reading or writing the file
            e.printStackTrace();
            response.setSuccess(false);
            response.setMessage("Server error");
            return ResponseEntity.status(500).body(response);  // Returning a 500 Internal Server Error response
        }
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

    // Helper method to write user data to the JSON file
    private void writeUserData(List<UserData> userDataList) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.writeValue(new File(jsonFilePath), userDataList);
    }
}
