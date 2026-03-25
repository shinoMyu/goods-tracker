package com.example.goods_tracker.controller;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import com.example.goods_tracker.entity.Order;
import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.repository.OrderRepository;
import com.example.goods_tracker.repository.PurchaseRepository;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final PurchaseRepository purchaseRepository;

    public OrderController(OrderRepository orderRepository,
                           PurchaseRepository purchaseRepository) {
        this.orderRepository = orderRepository;
        this.purchaseRepository = purchaseRepository;
    }

    // 建立訂單
    @PostMapping
    public Order create() {
        return orderRepository.save(new Order());
    }
    // 設定郵費
    @PostMapping("/{id}/shipping")
    public Order updateShipping(@PathVariable Integer id, @RequestBody BigDecimal fee) {

        Order order = orderRepository.findById(id).orElseThrow();
        order.setShippingFee(fee);

        return orderRepository.save(order);
    }
    // 分組 purchase
    @PostMapping("/group")
    public Order groupPurchases(@RequestBody List<Integer> purchaseIds) {

        Order order = new Order();
        orderRepository.save(order);

        for (Integer id : purchaseIds) {
            Purchase p = purchaseRepository.findById(id).orElseThrow();
            p.setOrder(order);
            purchaseRepository.save(p);
        }
        return order; 
    }

    @PostMapping("/{id}/color")
    public void setColor(@PathVariable Integer id,
                        @RequestBody Map<String, String> body) {

        Order order = orderRepository.findById(id).orElseThrow();
        order.setColor(body.get("color"));
        orderRepository.save(order);
    }
}