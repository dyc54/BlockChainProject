package com.swordnewnew.backend.controller;

// Importing necessary libraries and packages
import com.fasterxml.jackson.databind.ObjectMapper;
import com.swordnewnew.Response.RegistrationResponse;
import com.swordnewnew.Response.UserData;
import com.swordnewnew.requestBody.RegistrationRequest;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import org.springframework.web.bind.annotation.*;

// Annotating the class as a Rest Controller with Cross Origin support and mapping it to "/api" endpoint
@RestController
@CrossOrigin
@RequestMapping("/api")
public class RegistrationController {

    // Defining the path to the JSON file that stores user data
    private final String jsonFilePath = "src/main/data/user_data.json";

    // Mapping the registration endpoint to a POST request, expecting a JSON body with registration data
    @PostMapping("/registration")
    public RegistrationResponse register(@RequestBody RegistrationRequest request) {
        System.out.println("##################################");
        // Creating a response object to populate and return later
        RegistrationResponse response = new RegistrationResponse();
        try {
            System.out.println("**********************************");
            // Reading user data from the JSON file
            List<UserData> userDataList = readUserData();
            // Checking if the user already exists based on the email
            if (isDuplicateUser(userDataList, request.getEmail())) {
                System.out.println("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
                response.setSuccess(false);
                response.setMessage("username or email already exists");
                return response;
            }

            // Creating a new user object with the provided data
            UserData newUser = new UserData(request.getEmail(), request.getUserType(), request.getPassword());
            // Adding the new user to the list of users
            userDataList.add(newUser);

            // Writing the updated user data back to the JSON file
            writeUserData(userDataList);
            System.out.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
            response.setSuccess(true);
            response.setMessage("registration successful");
        } catch (IOException e) {
            // Handling IOException that might occur while reading or writing the file
            e.printStackTrace();
            response.setSuccess(false);
            response.setMessage("registration failed");
        }
        
        // Returning the response object
        return response;
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

    // Helper method to check if a user with the same email already exists
    private boolean isDuplicateUser(List<UserData> userDataList, String username) {
        for (UserData userData : userDataList) {
            if (userData.getEmail().equals(username)) {
                return true;
            }
        }
        return false;
    }
}

