package com.example.goods_tracker.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

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

    public List<Payment> getPaymentsByPurchaseId(Integer purchaseId) {
        return paymentRepository.findByPurchaseId(purchaseId);
    }

    public List<String> getExtraNotes() {
        return paymentRepository.findDistinctNotesByPaymentType("extra");
    }

    public List<Payment> getExtrasByPurchaseIds(List<Integer> purchaseIds) {
        if (purchaseIds.isEmpty()) return List.of();
        return paymentRepository.findByPaymentTypeAndPurchaseIdIn("extra", purchaseIds);
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

    public void updateExtra(Purchase purchase, Map<String, String> body) {

        Payment payment = paymentRepository
                .findByPurchaseIdAndPaymentType(purchase.getId(), "extra")
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setPurchase(purchase);
                    p.setPaymentType("extra");
                    return p;
                });

        if (body.containsKey("extra")) {
            payment.setPaidAmount(new BigDecimal(body.get("extra")));
        }

        if (body.containsKey("extraNote")) {
            String note = body.get("extraNote");
            payment.setNote(note != null && note.isBlank() ? null : (note != null ? note.trim() : null));
        }

        paymentRepository.save(payment);
    }
}