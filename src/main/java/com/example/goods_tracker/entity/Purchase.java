package com.example.goods_tracker.entity;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.math.BigDecimal;

@Data
@Entity
@Table(name = "purchase")
public class Purchase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private Integer orderId;
    private LocalDate purchaseDate;
    private String itemName;
    private String category;
    private String workTitle;
    private BigDecimal totalPrice;
    private String paymentSource;
    private String purchaseType;
    private Boolean received;
    private String note;
}