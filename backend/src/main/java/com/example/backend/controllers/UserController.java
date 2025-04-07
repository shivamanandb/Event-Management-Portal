package com.example.backend.controllers;

import com.example.backend.repository.UserRepository;
import com.example.backend.services.UserService;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.helper.*;
import com.example.backend.DTOs.UpdateUserDTO;
import com.example.backend.models.User;

@RestController
@RequestMapping("/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    // creating User
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody User user, @RequestParam String role) {
        
        UserValidation userValidation = new UserValidation();

        try{

            // validate email
            if(user.getEmail() == null || !userValidation.isValidEmail(user.getEmail())){
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Invalid Email"));
            }

            // validate email if already exists
            if(this.userRepository.findByEmail(user.getEmail()) != null){
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Email already exists"));
            }

            // validate password
            if(user.getPassword() == null || !userValidation.isStrongPassword(user.getPassword())){
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters"));
            }

            // validate name
            if(user.getName() == null){
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Name cannot be empty"));
            }

            // validate phone number
            if(user.getPhoneNo() == null || !userValidation.isValidPhoneNumber(user.getPhoneNo())){
                return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Invalid Phone Number"));
            }

            // validate organization name and description for ORGANIZER role
            if(role.equals("ORGANIZER")){
                if(user.getOrganizationName() == null || user.getDescription() == null){
                    return ResponseEntity.badRequest().body(new ApiResponse(false, "Error: Organization name and description cannot be empty"));
                }
            }

        }catch(Exception e){
            System.out.println("Error: "+e.getMessage());
        }
        User createdUser = this.userService.createUser(user, role);

        return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
    }
    
    
    
    @PutMapping("/update")
    public ResponseEntity<?> updateUser(@RequestBody UpdateUserDTO updateUserData, Principal principal) {

        if(updateUserData.getRole().equals("ORGANIZER") && 
        (updateUserData.getorganizationName() == null || updateUserData.getDescription() == null)
        || updateUserData.getName() == null || updateUserData.getEmail() == null || updateUserData.getPhoneNo() == null
        || !updateUserData.getEmail().endsWith("@gmail.com")
        || updateUserData.getPhoneNo().charAt(0)=='0'
        || updateUserData.getPhoneNo().length() != 10){
            return ResponseEntity.badRequest().body("Error: Enter Correct Data");
        }

        String phone = updateUserData.getPhoneNo();
        for(Integer i=0; i<phone.length(); i++){
            if(phone.charAt(i)>='0' && phone.charAt(i)<='9'){

            }else{
                return ResponseEntity.badRequest().body("Error: Invalid Number number");
            }
        }
        this.userService.updateUserData(updateUserData, principal);
        return ResponseEntity.ok("Profile updated Successfully");
    }

}