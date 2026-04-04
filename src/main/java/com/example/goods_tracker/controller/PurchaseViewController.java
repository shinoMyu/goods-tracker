package com.example.goods_tracker.controller;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import com.example.goods_tracker.entity.*;
import com.example.goods_tracker.repository.*;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;

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
        List<Purchase> purchases = purchaseRepository.findAllByOrderByIdAsc();

        Map<Integer, Long> orderCountMap = purchases.stream()
                .filter(p -> p.getOrder() != null)
                .collect(Collectors.groupingBy(
                        p -> p.getOrder().getId(),
                        Collectors.counting()));

        model.addAttribute("purchases", purchaseRepository.findAllByOrderByIdAsc());
        model.addAttribute("orderCountMap", orderCountMap);

        return "purchases/list";
    }

    private void prepareForm(Model model, Purchase purchase) {
        model.addAttribute("purchase", purchase);
        model.addAttribute("works", workRepository.findAll());
        model.addAttribute("categories", purchaseRepository.findAllCategories());
    }

    private Purchase createDefaultPurchase() {
        Optional<LocalDate> lastDate = purchaseRepository.findLatestPurchaseDate();
        LocalDate defaultDate = lastDate.orElse(LocalDate.now());

        Purchase purchase = new Purchase();
        purchase.setPurchaseDate(defaultDate);

        Purchase last = purchaseRepository.findTopByOrderByIdDesc();
        if (last != null) {
            purchase.setPaymentSource(last.getPaymentSource());
            purchase.setPurchaseType(last.getPurchaseType());
        }

        return purchase;
    }

    private LocalDate getMinDate() {
        return purchaseRepository
                .findEarliestPurchaseDate()
                .orElse(LocalDate.now());
    }

    @GetMapping("/new")
    public String newPurchaseForm(Model model) {
        Purchase purchase = createDefaultPurchase();

        prepareForm(model, purchase);
        model.addAttribute("minDate", getMinDate());
        return "purchases/new";
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
        Order order = new Order();
        return orderRepository.save(order);
    }

    @Getter
    @AllArgsConstructor
    public class PaymentValidationResult {
        private String error;
        private BigDecimal total;
    }

    private PaymentValidationResult validatePayment(
            String payMode,
            BigDecimal totalPrice,
            BigDecimal deposit,
            BigDecimal balance) {

        if ("single".equals(payMode)) {
            if (totalPrice == null) {
                return new PaymentValidationResult("請輸入金額", null);
            }
            return new PaymentValidationResult(null, totalPrice);
        }

        if ("deposit".equals(payMode)) {
            if (deposit == null) {
                return new PaymentValidationResult("請輸入訂金", null);
            }
            return new PaymentValidationResult(null, deposit);
        }

        // installment
        if (deposit == null || balance == null) {
            return new PaymentValidationResult("請輸入訂金和尾款", null);
        }

        return new PaymentValidationResult(null, deposit.add(balance));
    }

    private void savePayment(
            Purchase purchase,
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

    private String returnWithError(Model model, Purchase purchase, String workTitle) {
        model.addAttribute("minDate", getMinDate());
        model.addAttribute("workTitle", workTitle);
        prepareForm(model, purchase);
        return "purchases/new";
    }

    @PostMapping
    public String createPurchase(
            @Valid @ModelAttribute Purchase purchase,
            BindingResult bindingResult,
            @RequestParam String purchaseMonth,
            @RequestParam String workTitle,
            @RequestParam String payMode,
            @RequestParam(required = false) BigDecimal totalPrice,
            @RequestParam(required = false) BigDecimal deposit,
            @RequestParam(required = false) BigDecimal balance,
            Model model) {

        purchase.setPurchaseDate(parseMonth(purchaseMonth));

        boolean hasError = false;

        if (bindingResult.hasErrors()) {
            hasError = true;
        }

        if (workTitle == null || workTitle.trim().isEmpty()) {
            model.addAttribute("workError", "請輸入作品");
            hasError = true;
        }

        PaymentValidationResult result = validatePayment(payMode, totalPrice, deposit, balance);
        if (result.getError() != null) {
            model.addAttribute("paymentError", result.getError());
            hasError = true;
        }

        if (hasError) {
            return returnWithError(model, purchase, workTitle);
        }

        purchase.setWork(findOrCreateWork(workTitle));
        purchase.setOrder(createOrder());
        purchase.setTotalPrice(result.getTotal());

        purchaseRepository.save(purchase);

        savePayment(purchase, payMode, deposit, balance);
        return "redirect:/purchases/view";
    }

    @PostMapping("/{id}/received")
    @ResponseBody
    public void updateReceived(@PathVariable Integer id,
            @RequestBody Map<String, Boolean> body) {

        Boolean received = body.get("received");
        Purchase p = purchaseRepository.findById(id).orElseThrow();
        p.setReceived(received);
        purchaseRepository.save(p);
    }

    @GetMapping("/batch")
    public String batchForm(Model model) {
        LocalDate minDate = purchaseRepository.findEarliestPurchaseDate().orElse(LocalDate.now());
        Purchase base = createDefaultPurchase();
        model.addAttribute("minDate", minDate);
        model.addAttribute("basePurchase", base);
        prepareForm(model, new Purchase());
        return "purchases/batch";
    }
}