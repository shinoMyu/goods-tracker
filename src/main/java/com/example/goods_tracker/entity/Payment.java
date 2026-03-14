package com.example.goods_tracker.entity;
import jakarta.persistence.*;
import java.math.BigDecimal;
import lombok.Data;

@Data
@Entity
@Table(name = "payment")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private BigDecimal paidAmount;
    private String paymentType;
    private String note;

    @ManyToOne
    @JoinColumn(name = "purchase_id")
    private Purchase purchase;
}
