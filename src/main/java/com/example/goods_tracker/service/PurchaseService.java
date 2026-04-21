package com.example.goods_tracker.service;

import java.math.BigDecimal;
import java.time.LocalDate;

import com.example.goods_tracker.dto.*;
import com.example.goods_tracker.entity.*;
import com.example.goods_tracker.repository.*;
import org.springframework.stereotype.Service;

@Service
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final WorkRepository workRepository;
    private final OrderRepository orderRepository;
    private final PaymentService paymentService;

    public PurchaseService(PurchaseRepository purchaseRepository,
            WorkRepository workRepository,
            OrderRepository orderRepository,
            PaymentService paymentService) {
        this.purchaseRepository = purchaseRepository;
        this.workRepository = workRepository;
        this.orderRepository = orderRepository;
        this.paymentService = paymentService;
    }

    public Purchase createDefaultPurchase() {
        LocalDate defaultDate = purchaseRepository.findLatestPurchaseDate()
                .orElse(LocalDate.now());

        Purchase purchase = new Purchase();
        purchase.setPurchaseDate(defaultDate);

        Purchase last = purchaseRepository.findTopByOrderByIdDesc();
        if (last != null) {
            purchase.setPaymentSource(last.getPaymentSource());
            purchase.setPurchaseType(last.getPurchaseType());
        }

        return purchase;
    }

    public LocalDate getMinDate() {
        return purchaseRepository.findEarliestPurchaseDate()
                .orElse(LocalDate.now());
    }

    private LocalDate parseMonth(String month) {
        return LocalDate.parse(month + "-01");
    }

    private Work findOrCreateWork(String title) {
        return workRepository.findByTitle(title)
                .orElseGet(() -> {
                    Work w = new Work();
                    w.setTitle(title);
                    return workRepository.save(w);
                });
    }

    private Order createOrder() {
        return orderRepository.save(new Order());
    }

    public PaymentService.PaymentResult createPurchase(
            Purchase purchase,
            String purchaseMonth,
            String workTitle,
            String payMode,
            BigDecimal totalPrice,
            BigDecimal deposit,
            BigDecimal balance) {

        purchase.setPurchaseDate(parseMonth(purchaseMonth));

        PaymentService.PaymentResult result = paymentService.validate(payMode, totalPrice, deposit, balance);

        if (result.getError() != null) {
            return result;
        }

        purchase.setWork(findOrCreateWork(workTitle));
        purchase.setOrder(createOrder());
        purchase.setTotalPrice(result.getTotal());

        purchaseRepository.save(purchase);

        paymentService.save(purchase, payMode, deposit, balance);

        return result;
    }
    
    public PaymentService.PaymentResult createBatchItem(
            BatchRequest request,
            BatchItem item) {

        LocalDate date = parseMonth(request.getPurchaseMonth());

        PaymentService.PaymentResult result = paymentService.validate(
                item.getPayMode(),
                item.getTotalPrice(),
                item.getDeposit(),
                item.getBalance());

        if (result.getError() != null) {
            return result;
        }

        Purchase purchase = new Purchase();

        // base（共用）
        purchase.setPurchaseDate(date);
        purchase.setPaymentSource(request.getPaymentSource());
        purchase.setPurchaseType(request.getPurchaseType());
        purchase.setReceived(request.getReceived());

        // item
        purchase.setCategory(item.getCategory());
        purchase.setItemName(item.getItemName());

        purchase.setWork(findOrCreateWork(item.getWorkTitle()));
        purchase.setOrder(createOrder());

        purchase.setTotalPrice(result.getTotal());

        purchaseRepository.save(purchase);

        paymentService.save(
                purchase,
                item.getPayMode(),
                item.getDeposit(),
                item.getBalance());

        return result;
    }

    public Purchase updatePurchase(Integer id, String name, String note) {
        Purchase p = purchaseRepository.findById(id).orElseThrow();

        if (name != null) {
            if (name.trim().isEmpty()) {
                throw new IllegalArgumentException("名稱不能為空");
            }
            p.setItemName(name.trim());
        }
        if (note != null) {
            p.setNote(note);
        }
        return purchaseRepository.save(p);
    }
}