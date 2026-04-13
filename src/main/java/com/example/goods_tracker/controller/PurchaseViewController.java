package com.example.goods_tracker.controller;

import java.math.BigDecimal;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import com.example.goods_tracker.dto.*;
import com.example.goods_tracker.entity.*;
import com.example.goods_tracker.repository.*;
import com.example.goods_tracker.service.*;

import jakarta.validation.Valid;

@Controller
@RequestMapping("/purchases")
public class PurchaseViewController {

    private final PurchaseRepository purchaseRepository;
    private final WorkRepository workRepository;
    private final PurchaseService purchaseService;
    private final PaymentService paymentService;

    public PurchaseViewController(
            PurchaseRepository purchaseRepository,
            WorkRepository workRepository,
            PurchaseService purchaseService,
            PaymentRepository paymentRepository,
            OrderRepository orderRepository,
            PaymentService paymentService) {
        this.purchaseRepository = purchaseRepository;
        this.workRepository = workRepository;
        this.purchaseService = purchaseService;
        this.paymentService = paymentService;
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

    private void prepareForm(Model model) {
        model.addAttribute("works", workRepository.findAll());
        model.addAttribute("categories", purchaseRepository.findAllCategories());
    }

    @GetMapping("/new")
    public String newPurchaseForm(Model model) {
        prepareForm(model);
        model.addAttribute("minDate", purchaseService.getMinDate());
        model.addAttribute("purchase", purchaseService.createDefaultPurchase());
        return "purchases/new";
    }

    private String returnWithError(Model model, Purchase purchase, String workTitle) {
        model.addAttribute("minDate", purchaseService.getMinDate());
        model.addAttribute("workTitle", workTitle);
        prepareForm(model);
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

        boolean hasError = false;

        if (bindingResult.hasErrors()) {
            hasError = true;
        }

        if (workTitle == null || workTitle.trim().isEmpty()) {
            model.addAttribute("workError", "請輸入作品");
            hasError = true;
        }

        PaymentService.PaymentResult result = purchaseService.createPurchase(
                purchase,
                purchaseMonth,
                workTitle,
                payMode,
                totalPrice,
                deposit,
                balance);
                
        if (result.getError() != null) {
            model.addAttribute("paymentError", result.getError());
            hasError = true;
        }

        if (hasError) {
            return returnWithError(model, purchase, workTitle);
        }

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
        BatchRequest request = new BatchRequest();

        request.setItems(new ArrayList<>());

        model.addAttribute("request", request);
        model.addAttribute("basePurchase", purchaseService.createDefaultPurchase());
        model.addAttribute("minDate", purchaseService.getMinDate());
        prepareForm(model);
        return "purchases/batch";
    }

    @PostMapping("/batch")
    public String createBatch(
            @Valid @ModelAttribute BatchRequest request,
            BindingResult bindingResult,
            Model model) {
        boolean hasError = false;

        if (bindingResult.hasErrors()) {

            for (FieldError error : bindingResult.getFieldErrors()) {

                String field = error.getField();

                int start = field.indexOf('[');
                int end = field.indexOf(']');
                int index = Integer.parseInt(field.substring(start + 1, end));

                String message = error.getDefaultMessage();

                request.getItems().get(index).getErrors().add(message);
            }
            hasError = true;
        }

        for (BatchItem item : request.getItems()) {

            PaymentService.PaymentResult result = paymentService.validate(
                    item.getPayMode(),
                    item.getTotalPrice(),
                    item.getDeposit(),
                    item.getBalance());

            if (result.getError() != null) {
                item.getErrors().add(result.getError());
                hasError = true;
            }
        }

        if (hasError) {
            model.addAttribute("request", request);
            model.addAttribute("minDate", purchaseService.getMinDate());
            model.addAttribute("basePurchase", purchaseService.createDefaultPurchase());
            prepareForm(model);

            return "purchases/batch";
        }

        for (BatchItem item : request.getItems()) {
            purchaseService.createBatchItem(request, item);
        }
        return "redirect:/purchases/view";
    }
}