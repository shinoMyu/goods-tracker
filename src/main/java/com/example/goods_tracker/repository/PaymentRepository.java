package com.example.goods_tracker.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.goods_tracker.entity.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByPurchaseId(Integer purchaseId);

    Optional<Payment> findByPurchaseIdAndPaymentType(Integer purchaseId, String paymentType);
}
