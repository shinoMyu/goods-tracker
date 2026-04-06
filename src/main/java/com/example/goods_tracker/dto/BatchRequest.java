package com.example.goods_tracker.dto;

import java.util.List;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BatchRequest {
    private String purchaseMonth;
    private String paymentSource;
    private String purchaseType;
    private Boolean received;

    @Valid
    private List<BatchItem> items;
}
