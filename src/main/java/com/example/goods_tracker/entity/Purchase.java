package com.example.goods_tracker.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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
    private LocalDate purchaseDate;
    
    @NotBlank(message = "名稱不能為空")
    private String itemName;
    @NotBlank(message = "種類不能為空")
    private String category;
    
    private BigDecimal totalPrice;
    private String paymentSource;
    private String purchaseType;
    private Boolean received;
    private String note;

    @ManyToOne
    @JoinColumn(name = "work_id")
    private Work work;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
}