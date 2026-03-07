package com.example.goods_tracker.controller;
import com.example.goods_tracker.entity.Payment;
import com.example.goods_tracker.repository.PaymentRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payment")
public class PaymentController {

    private final PaymentRepository repository;

    public PaymentController(PaymentRepository repository) {
        this.repository = repository;
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
    public List<Payment> getByPurchase(@PathVariable Integer id) {
        return repository.findByPurchaseId(id);
    }
}