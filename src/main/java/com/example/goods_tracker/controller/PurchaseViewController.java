package com.example.goods_tracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import com.example.goods_tracker.entity.Order;
import com.example.goods_tracker.entity.Payment;
import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.entity.Work;
import com.example.goods_tracker.repository.OrderRepository;
import com.example.goods_tracker.repository.PaymentRepository;
import com.example.goods_tracker.repository.PurchaseRepository;
import com.example.goods_tracker.repository.WorkRepository;

@Controller
@RequestMapping("/purchases")
public class PurchaseViewController {

    private final PurchaseRepository purchaseRepository;
    private final WorkRepository workRepository;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    public PurchaseViewController(
            PurchaseRepository purchaseRepository,
            WorkRepository workRepository,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository) {
        this.purchaseRepository = purchaseRepository;
        this.workRepository = workRepository;
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
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

        Order order = new Order();
        orderRepository.save(order);
        purchase.setOrder(order);

        BigDecimal total;

        if ("single".equals(payMode)) {        
            if (purchase.getTotalPrice() == null) {
                model.addAttribute("error", "請輸入金額");
                prepareForm(model, purchase);
                return "purchases/new";
            }        
            total = purchase.getTotalPrice();
        }
        
        else if ("deposit".equals(payMode)) {        
            if (deposit == null) {
                model.addAttribute("error", "請輸入訂金");
                prepareForm(model, purchase);
                return "purchases/new";
            }        
            total = deposit;
        }
    
        else { // installment        
            if (deposit == null || balance == null) {
                model.addAttribute("error", "請輸入訂金和尾款");
                prepareForm(model, purchase);
                return "purchases/new";
            }
            total = deposit.add(balance);
        }
        
        purchase.setTotalPrice(total);

        purchaseRepository.save(purchase);

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
        
        return "redirect:/purchases/view";
    }

    @PostMapping("/{id}/received")
    public void updateReceived(@PathVariable Integer id,
                            @RequestBody Boolean received) {

        Purchase p = purchaseRepository.findById(id).orElseThrow();
        p.setReceived(received);
        purchaseRepository.save(p);
    }

    // @PostMapping("/order/{id}/fee")
    // public Order setFee(@PathVariable Integer id, @RequestBody Order body) {
    //     Order o = orderRepo.findById(id).orElseThrow();
    //     o.setShippingFee(body.getShippingFee());
    //     return orderRepo.save(o);
    // }
}
