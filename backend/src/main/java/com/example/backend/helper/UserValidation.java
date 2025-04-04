package com.example.backend.helper;

import java.util.regex.Pattern;

import org.springframework.http.ResponseEntity;

public class UserValidation {

    // methods for validation
    public boolean isValidEmail(String email) {
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        Pattern pattern = Pattern.compile(emailRegex);
        return pattern.matcher(email).matches();
    }

    public boolean isStrongPassword(String password) {
        // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
        String passwordRegex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])(?=\\S+$).{8,}$";
        Pattern pattern = Pattern.compile(passwordRegex);
        return pattern.matcher(password).matches();
    }

    public boolean isValidPhoneNumber(String phoneNo) {

        // Check if the phone number is 10 digits long and contains only numbers
        if(phoneNo.length() != 10){
            return false;
        }

        // check if the phone number contains only digits
        for(Integer i=0; i<phoneNo.length(); i++){
            if(phoneNo.charAt(i)>='0' && phoneNo.charAt(i)<='9'){

            }else{
                return false;
            }
        }
        return true;
    }

}
