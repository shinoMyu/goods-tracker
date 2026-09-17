package com.example.goods_tracker.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.*;
import com.example.goods_tracker.entity.Order;
import com.example.goods_tracker.repository.OrderRepository;
import com.example.goods_tracker.service.OrderService;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final OrderService orderService;


    public OrderController(OrderRepository orderRepository,
                           OrderService orderService) {
        this.orderRepository = orderRepository;
        this.orderService = orderService;
    }

    // 建立訂單
    @PostMapping
    public Order create() {
        return orderRepository.save(new Order());
    }

    // 更新郵費 / 郵費說明
    @PutMapping("/{id}/shipping")
    public Order updateShipping(@PathVariable Integer id,
                                @RequestBody Map<String, String> body) {
        return orderService.updateShipping(id, body);
    }

    // 分組 purchase
    @PostMapping("/group")
    public Order groupPurchases(@RequestBody List<Integer> purchaseIds) {
        return orderService.groupPurchases(purchaseIds); 
    }

    @PostMapping("/{id}/color")
    public void setColor(@PathVariable Integer id,
                        @RequestBody Map<String, String> body) {
        orderService.updateColor(id, body.get("color"));
    }

    @PutMapping("/{id}/no-shipping")
    public void setNoShipping(@PathVariable Integer id,
                              @RequestBody Map<String, Boolean> body) {
        orderService.setNoShipping(id, body.get("value"));
    }
}