package com.example.goods_tracker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.goods_tracker.entity.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Integer> {
}