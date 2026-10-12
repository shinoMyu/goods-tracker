package com.example.goods_tracker.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.goods_tracker.entity.*;
import com.example.goods_tracker.repository.*;
import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final PurchaseRepository purchaseRepository;

    public PaymentService(PaymentRepository paymentRepository,
                          PurchaseRepository purchaseRepository) {
        this.paymentRepository = paymentRepository;
        this.purchaseRepository = purchaseRepository;
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
            createPayment(purchase, "deposit", deposit);
        }

        if ("installment".equals(payMode)) {
            createPayment(purchase, "balance", balance);
        }
    }

    private Payment createPayment(Purchase purchase, String type, BigDecimal amount) {
        Payment p = new Payment();
        p.setPurchase(purchase);
        p.setPaymentType(type);
        p.setPaidAmount(amount);
        return paymentRepository.save(p);
    }

    public void addBalance(Purchase purchase, BigDecimal balance) {
        Optional<Payment> existingBalance = paymentRepository
                .findByPurchaseIdAndPaymentType(purchase.getId(), "balance");
        if (existingBalance.isPresent()) {
            throw new IllegalStateException("尾款已存在");
        }

        createPayment(purchase, "balance", balance);

        BigDecimal newTotal = purchase.getTotalPrice().add(balance);
        purchase.setTotalPrice(newTotal);
        purchaseRepository.save(purchase);
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