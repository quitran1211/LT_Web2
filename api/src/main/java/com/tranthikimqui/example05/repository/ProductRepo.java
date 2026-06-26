package com.tranthikimqui.example05.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tranthikimqui.example05.entity.Product;

@Repository
public interface ProductRepo extends JpaRepository<Product, Long> {

    // 🔍 Tìm theo tên sản phẩm (tự động thêm %keyword%)
    Page<Product> findByProductNameContainingIgnoreCase(String keyword, Pageable pageDetails);

    // 🔍 Tìm theo danh mục
    Page<Product> findByCategoryCategoryId(Long categoryId, Pageable pageDetails);

    // 🔍 Tìm theo danh mục + tên sản phẩm
    Page<Product> findByCategoryCategoryIdAndProductNameContainingIgnoreCase(
            Long categoryId, String keyword, Pageable pageDetails);
}
