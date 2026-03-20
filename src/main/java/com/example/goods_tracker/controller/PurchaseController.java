package com.example.goods_tracker.controller;

import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.repository.PurchaseRepository;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/purchase")
public class PurchaseController {

    private final PurchaseRepository repository;

    public PurchaseController(PurchaseRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public Purchase create(@RequestBody Purchase purchase) {
        return repository.save(purchase);
    }

    @GetMapping
    public List<Purchase> getAll() {
        return repository.findAll();
    }
}