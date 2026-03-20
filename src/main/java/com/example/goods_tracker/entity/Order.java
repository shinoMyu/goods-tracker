package com.example.goods_tracker.entity;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
// import java.util.List;

@Entity
@Table(name = "orders")
@Data
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private BigDecimal shippingFee; 
    private String color;
    
//     // private BigDecimal domesticShipping;
//     // private BigDecimal internationalShipping;
//     // private String shippingType; // normal / international / ems

//     @OneToMany(mappedBy = "order")
//     private List<Purchase> purchases;
}