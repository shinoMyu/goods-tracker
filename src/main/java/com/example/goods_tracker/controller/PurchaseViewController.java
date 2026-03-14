package com.example.goods_tracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.goods_tracker.entity.Payment;
import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.entity.Work;
import com.example.goods_tracker.repository.PaymentRepository;
import com.example.goods_tracker.repository.PurchaseRepository;
import com.example.goods_tracker.repository.WorkRepository;

@Controller
@RequestMapping("/purchases")
public class PurchaseViewController {

    private final PurchaseRepository purchaseRepository;
    private final WorkRepository workRepository;
    private final PaymentRepository paymentRepository;

    public PurchaseViewController(
            PurchaseRepository purchaseRepository,
            WorkRepository workRepository,
            PaymentRepository paymentRepository) {
        this.purchaseRepository = purchaseRepository;
        this.workRepository = workRepository;
        this.paymentRepository = paymentRepository;
    }

    @GetMapping("/view")
    public String viewPurchases(Model model) {
        model.addAttribute("purchases", purchaseRepository.findAllByOrderByIdAsc());
        return "purchases/list";
    }

    private void prepareForm(Model model, Purchase purchase){
        model.addAttribute("purchase", purchase);
        model.addAttribute("works", workRepository.findAll());
        model.addAttribute("categories", purchaseRepository.findAllCategories());
    }

    @GetMapping("/new")
    public String newPurchaseForm(Model model) {
        Optional<LocalDate> lastDate = purchaseRepository.findLatestPurchaseDate();
        LocalDate defaultDate = lastDate.orElse(LocalDate.now());

        LocalDate minDate = purchaseRepository.findEarliestPurchaseDate().orElse(LocalDate.now());
        Purchase purchase = new Purchase();
        purchase.setPurchaseDate(defaultDate);
        
        Purchase last = purchaseRepository.findTopByOrderByIdDesc();
        if (last != null) {
            purchase.setPaymentSource(last.getPaymentSource());
            purchase.setPurchaseType(last.getPurchaseType());
        }

        prepareForm(model, purchase);
        model.addAttribute("minDate", minDate);
        return "purchases/new";
    }

    @PostMapping
    public String createPurchase(
            Purchase purchase,
            @RequestParam String workTitle,
            @RequestParam String purchaseMonth,
            @RequestParam String payMode,
            @RequestParam(required = false) BigDecimal deposit,
            @RequestParam(required = false) BigDecimal balance,
            Model model) {
        purchase.setPurchaseDate(LocalDate.parse(purchaseMonth + "-01"));

        Work work = workRepository.findByTitle(workTitle).orElseGet(() -> {
            Work w = new Work();
            w.setTitle(workTitle);
            return workRepository.save(w);
        });
        purchase.setWork(work);

        if ("single".equals(payMode) && purchase.getTotalPrice() == null) {
            model.addAttribute("error", "請輸入金額");
            prepareForm(model, purchase);
            return "purchases/new";
        }    
        else if ("deposit".equals(payMode) && deposit == null) {
            model.addAttribute("error", "請輸入訂金");
            prepareForm(model, purchase);
            return "purchases/new";
        }  
        else if ("installment".equals(payMode) && (deposit == null || balance == null)) {
            model.addAttribute("error", "請輸入訂金和尾款");
            prepareForm(model, purchase);
            return "purchases/new";
        }

        purchaseRepository.save(purchase);

        if ("deposit".equals(payMode)) {
            purchase.setTotalPrice(deposit);
            
            Payment p = new Payment();
            p.setPurchase(purchase);
            p.setPaymentType("deposit");
            p.setPaidAmount(deposit);

            paymentRepository.save(p);
        }
        if ("installment".equals(payMode)) {
            purchase.setTotalPrice(deposit.add(balance));

            Payment p1 = new Payment();
            p1.setPurchase(purchase);
            p1.setPaymentType("deposit");
            p1.setPaidAmount(deposit);

            Payment p2 = new Payment();
            p2.setPurchase(purchase);
            p2.setPaymentType("balance");
            p2.setPaidAmount(balance);

            paymentRepository.save(p1);
            paymentRepository.save(p2);
        }
        
        return "redirect:/purchases/view";
    }
}
