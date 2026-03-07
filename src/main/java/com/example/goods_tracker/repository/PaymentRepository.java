package com.example.goods_tracker.repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.goods_tracker.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {
    List<Payment> findByPurchaseId(Integer purchaseId);
}
