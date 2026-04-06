package com.example.goods_tracker.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BatchItem {
    @NotBlank(message = "名稱不能為空")
    private String itemName;

    @NotBlank(message = "作品不能為空")
    private String workTitle;

    @NotBlank(message = "種類不能為空")
    private String category;

    private BigDecimal totalPrice;
    private BigDecimal deposit;
    private BigDecimal balance;
    private String payMode;

    private List<String> errors = new ArrayList<>();
}
