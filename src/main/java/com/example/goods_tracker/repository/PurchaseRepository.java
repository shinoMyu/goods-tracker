package com.example.goods_tracker.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.goods_tracker.entity.Purchase;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Integer> {
    List<Purchase> findAllByOrderByIdAsc();
    
    @Query("SELECT DISTINCT p.category FROM Purchase p")
    List<String> findAllCategories();

    @Query("SELECT MAX(p.purchaseDate) FROM Purchase p")
    Optional<LocalDate> findLatestPurchaseDate();

    @Query("SELECT MIN(p.purchaseDate) FROM Purchase p")
    Optional<LocalDate> findEarliestPurchaseDate();

    Purchase findTopByOrderByIdDesc();
}
