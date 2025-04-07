package com.example.backend.controllers;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.models.Event;
import com.example.backend.models.MyOrder;
import com.example.backend.repository.EventRepository;
import com.example.backend.repository.MyOrderRepository;
import com.razorpay.*;

@RestController
@RequestMapping("/payment")
public class RazorpayController {

    @Value("${razorpay.key.id}")
    private String keyId;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private MyOrderRepository myOrderRepository;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    private Event event;

    
    @PreAuthorize("hasAuthority('ATTENDEE')")
    @GetMapping("/razorpay-key")
    public String paymentKeyResponse(){
        return keyId;
    }

    @PreAuthorize("hasAuthority('ATTENDEE')")
    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> data) throws RazorpayException {
        System.out.println(data);
        int amount = Integer.parseInt(data.get("amount").toString());

        RazorpayClient client = new RazorpayClient(keyId, keySecret);

        // Creating options for the order
        JSONObject options = new JSONObject();
        options.put("amount", amount * 100);
        options.put("currency", "INR");
        options.put("receipt", String.join("", UUID.randomUUID().toString().split("-")).substring(0,15));

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

            event.getOrganizerDetails().setUser(null);

            return ResponseEntity.ok(event);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("failed to update payment");
        }
    }
}
