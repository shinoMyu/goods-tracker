package com.example.goods_tracker.controller;
import com.example.goods_tracker.entity.Payment;
import com.example.goods_tracker.repository.PaymentRepository;
import com.example.goods_tracker.service.PaymentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentRepository repository;
    private final PaymentService paymentService;

    public PaymentController(PaymentRepository repository,
                             PaymentService paymentService) {
        this.repository = repository;
        this.paymentService = paymentService;
    }

    @PostMapping
    public Payment create(@RequestBody Payment payment) {
        return repository.save(payment);
    }

    @GetMapping
    public List<Payment> getAll() {
        return repository.findAll();
    }
    
    @GetMapping("/purchase/{id}")
    public List<Payment> getPayments(@PathVariable Integer id) {
        return paymentService.getPaymentsByPurchaseId(id);
    }
}