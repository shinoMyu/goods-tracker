package com.example.goods_tracker.controller;

import java.time.LocalDate;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.repository.PurchaseRepository;

@Controller
@RequestMapping("/purchases")
public class PurchaseViewController {

    private final PurchaseRepository purchaseRepository;

    public PurchaseViewController(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @GetMapping("/view")
    public String viewPurchases(Model model) {
        model.addAttribute("purchases", purchaseRepository.findAll());
        return "purchases/list";
    }
    @GetMapping("/new")
    public String newPurchaseForm(Model model) {
        model.addAttribute("purchase", new Purchase());
        return "purchases/new";
    }
    @PostMapping
    public String createPurchase(@RequestParam String purchaseDate, Purchase purchase) {
        purchase.setPurchaseDate(
            LocalDate.parse(purchaseDate + "-01")
        );

        purchaseRepository.save(purchase);
        return "redirect:/purchases/view";
    }
}
