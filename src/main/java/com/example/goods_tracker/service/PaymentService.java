package com.example.goods_tracker.service;

import java.math.BigDecimal;

import com.example.goods_tracker.entity.*;
import com.example.goods_tracker.repository.*;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    @Getter
    @AllArgsConstructor
    public static class PaymentResult {
        private String error;
        private BigDecimal total;
    }

    public PaymentResult validate(String payMode,
                                  BigDecimal totalPrice,
                                  BigDecimal deposit,
                                  BigDecimal balance) {

        if ("single".equals(payMode)) {
            if (totalPrice == null) {
                return new PaymentResult("請輸入金額", null);
            }
            return new PaymentResult(null, totalPrice);
        }

        if ("deposit".equals(payMode)) {
            if (deposit == null) {
                return new PaymentResult("請輸入訂金", null);
            }
            return new PaymentResult(null, deposit);
        }

        if (deposit == null || balance == null) {
            return new PaymentResult("請輸入訂金和尾款", null);
        }

        return new PaymentResult(null, deposit.add(balance));
    }

    public void save(Purchase purchase,
                     String payMode,
                     BigDecimal deposit,
                     BigDecimal balance) {

        if (!"single".equals(payMode)) {
            Payment p = new Payment();
            p.setPurchase(purchase);
            p.setPaymentType("deposit");
            p.setPaidAmount(deposit);
            paymentRepository.save(p);
        }

        if ("installment".equals(payMode)) {
            Payment p = new Payment();
            p.setPurchase(purchase);
            p.setPaymentType("balance");
            p.setPaidAmount(balance);
            paymentRepository.save(p);
        }
    }
}
