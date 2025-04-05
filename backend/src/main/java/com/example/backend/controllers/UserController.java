package com.example.backend.controllers;

import com.example.backend.repository.EventRepository;
import com.example.backend.repository.MyOrderRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.services.UserService;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.razorpay.*;

import org.json.HTTP;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.helper.*;
import com.example.backend.DTOs.UpdateUserDTO;
import com.example.backend.models.Event;
import com.example.backend.models.MyOrder;
import com.example.backend.models.User;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private final UserRepository userRepository;

    @Autowired
    private final EventRepository eventRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private MyOrderRepository myOrderRepository;
    

    private Event event;

    UserController(EventRepository eventRepository, UserRepository userRepository) {
        this.eventRepository = eventRepository;
        this.userRepository = userRepository;
    }

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
    
    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        System.out.println(data);
        int amount = Integer.parseInt(data.get("amount").toString());

        RazorpayClient client = new RazorpayClient("rzp_test_V8mM0kjKmdKKSA", "0beBt7FFshdzV3J4vIhujp9k");
        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", "txn_12345");

        // creating new order
        Order order = client.orders.create(options);
        System.out.println("Order: " + order);

        // Saving order details
        MyOrder myOrder = new MyOrder();

        myOrder.setAmount((Integer) order.get("amount"));
        myOrder.setBookingOrderId((String) order.get("id"));
        myOrder.setPaymentReferenceId(null);
        myOrder.setPaymentStatus("created");
        myOrder.setPaymentReceipt((String) order.get("receipt"));

        this.myOrderRepository.save(myOrder);

        // Return response in the format expected by the frontend
        Map<String, Object> response = new HashMap<>();
        response.put("status", "created");
        response.put("amount", order.get("amount"));
        response.put("id", order.get("id"));

        return ResponseEntity.ok(response);
    }

    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PutMapping("/update-order")
    public ResponseEntity<?> updateOrder(@RequestBody Map<String, Object> data) {
        System.out.println("data: " + data);

        try {
            // Find the order
            MyOrder myOrder = this.myOrderRepository.findByBookingOrderId(data.get("bookingOrderId").toString());
            if (myOrder == null) {
                return ResponseEntity.badRequest().body(Map.of("message", "Order not found"));
            }

            // Update order details
            myOrder.setPaymentReferenceId(data.get("paymentReferanceId").toString());
            myOrder.setPaymentStatus(data.get("bookingStatus").toString());

            System.out.println("payment reference : " + myOrder.getPaymentReferenceId());
            System.out.println("payment status : " + myOrder.getPaymentStatus());

            // Save updated order
            this.myOrderRepository.save(myOrder);

            // If you have seat management, update available seats here
            Integer quantity = Integer.parseInt(data.get("quantityValue").toString());

            Long eventId = Long.parseLong(data.get("eventId").toString());
            Optional<Event> eventOptional = this.eventRepository.findById(eventId);
            if (eventOptional.isPresent()) {
                event = eventOptional.get();
            } else {
                // Handle case where event is not found
                return ResponseEntity.badRequest().body(Map.of("message", "Event not found"));
            }

            event.setRemainingSeat((event.getRemainingSeat()-quantity));
            this.eventRepository.save(event);
            // eventService.updateAvailableSeats(eventId, quantity);
            event.getOrganizerDetails().setUser(null);

            return ResponseEntity.ok(event);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("failed to update payment");
        }
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