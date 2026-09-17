package com.example.goods_tracker.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.goods_tracker.entity.Order;
import com.example.goods_tracker.entity.Purchase;
import com.example.goods_tracker.repository.OrderRepository;
import com.example.goods_tracker.repository.PurchaseRepository;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final PurchaseRepository purchaseRepository;

    public OrderService(OrderRepository orderRepository,
            PurchaseRepository purchaseRepository) {
        this.orderRepository = orderRepository;
        this.purchaseRepository = purchaseRepository;
    }

    public Order updateShipping(Integer id, Map<String, String> body) {
        Order order = orderRepository.findById(id).orElseThrow();
        updateShipping(order, body);
        return order;
    }

    public Order groupPurchases(List<Integer> purchaseIds) {
        Order order = orderRepository.save(new Order());

        for (Integer id : purchaseIds) {
            Purchase p = purchaseRepository.findById(id).orElseThrow();
            p.setOrder(order);
            purchaseRepository.save(p);
        }

        return order;
    }

    public void updateColor(Integer id, String color) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setColor(color);
        orderRepository.save(order);
    }

    public void updateShipping(Order order, Map<String, String> body) {
        if (order == null)
            return;

        if (body.containsKey("shipping")) {
            order.setShippingFee(new BigDecimal(body.get("shipping")));
        }

        if (body.containsKey("shippingNote")) {
            order.setShippingNote(body.get("shippingNote"));
        }

        orderRepository.save(order);
    }

    public void setNoShipping(Integer id, Boolean value) {
        Order order = orderRepository.findById(id).orElseThrow();
        order.setNoShipping(value);
        orderRepository.save(order);
    }
}
