package com.example.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend.models.MyOrder;

public interface MyOrderRepository extends JpaRepository <MyOrder, Long>{
    
    public MyOrder findByBookingOrderId(String bookingOrderId);

    public MyOrder findByPaymentReferenceId(String paymentReferenceId);
}
