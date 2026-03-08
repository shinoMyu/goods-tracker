package com.example.goods_tracker.repository;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.goods_tracker.entity.Work;

@Repository
public interface WorkRepository extends JpaRepository<Work, Integer> {
    Optional<Work> findByTitle(String title);
}