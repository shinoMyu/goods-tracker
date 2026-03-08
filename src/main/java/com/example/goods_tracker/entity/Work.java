package com.example.goods_tracker.entity;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "work")
public class Work {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String title;
    private String color;
}
