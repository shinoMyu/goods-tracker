package com.example.goods_tracker.controller;

import java.time.LocalDate;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.entity.Work;
import com.example.goods_tracker.repository.PurchaseRepository;
import com.example.goods_tracker.repository.WorkRepository;

@Controller
@RequestMapping("/purchases")
public class PurchaseViewController {

    private final PurchaseRepository purchaseRepository;
    private final WorkRepository workRepository;

    public PurchaseViewController(PurchaseRepository purchaseRepository, WorkRepository workRepository) {
        this.purchaseRepository = purchaseRepository;
        this.workRepository = workRepository;
    }

    @GetMapping("/view")
    public String viewPurchases(Model model) {
        model.addAttribute("purchases", purchaseRepository.findAll());
        return "purchases/list";
    }

    @GetMapping("/new")
    public String newPurchaseForm(Model model) {
        model.addAttribute("purchase", new Purchase());
        model.addAttribute("works", workRepository.findAll());
        return "purchases/new";
    }

    @PostMapping
    public String createPurchase(
        Purchase purchase, 
        @RequestParam String workTitle, 
        @RequestParam String purchaseDate
    ) {
        purchase.setPurchaseDate(
            LocalDate.parse(purchaseDate + "-01")
        );

        Work work = workRepository.findByTitle(workTitle)
        .orElseGet(() -> {
            Work w = new Work();
            w.setTitle(workTitle);
            return workRepository.save(w);
        });
        purchase.setWork(work);
        purchaseRepository.save(purchase);
        return "redirect:/purchases/view";
    }
}
