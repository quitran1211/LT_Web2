package com.tranthikimqui.example05.payloads;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductDTO {
    private Long productId;
    private String productName;
    private String image;
    private String description;
    private Integer quantity;
    private double price;
    private double discount;
    private double specialPrice;
    private CategoryDTO category; // ✅ Thêm dòng này
    // ✅ Thêm:

    public Long getCategoryId() {
        return category != null ? category.getCategoryId() : null;
    }
}