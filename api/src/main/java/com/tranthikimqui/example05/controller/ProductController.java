package com.tranthikimqui.example05.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tranthikimqui.example05.config.AppConstants;
import com.tranthikimqui.example05.entity.Product;
import com.tranthikimqui.example05.payloads.ProductDTO;
import com.tranthikimqui.example05.payloads.ProductResponse;
import com.tranthikimqui.example05.service.ProductService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    // ✅ Thêm sản phẩm
    @PostMapping("/admin/categories/{categoryId}/products")
    public ResponseEntity<ProductDTO> addProduct(
            @Valid @RequestBody Product product,
            @PathVariable Long categoryId) {

        ProductDTO savedProduct = productService.addProduct(categoryId, product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // ✅ Lấy 1 sản phẩm theo ID
    @GetMapping("/public/products/{productId}")
    public ResponseEntity<ProductDTO> getOneProduct(@PathVariable Long productId) {
        ProductDTO productDTO = productService.getProductById(productId);
        return new ResponseEntity<>(productDTO, HttpStatus.OK);
    }

    // ✅ Lấy tất cả sản phẩm hoặc tìm kiếm theo từ khóa (?search=)
    @GetMapping("/public/products")
    public ResponseEntity<ProductResponse> getAllOrSearchProducts(
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "categoryId", defaultValue = "0", required = false) Long categoryId) {
        ProductResponse productResponse;

        // Nếu có từ khóa => tìm kiếm
        if (search != null && !search.isBlank()) {
            productResponse = productService.searchProductByKeyword(
                    search,
                    categoryId,
                    pageNumber == 0 ? pageNumber : pageNumber - 1,
                    pageSize,
                    "id".equals(sortBy) ? "productId" : sortBy,
                    sortOrder);
        } else {
            // Nếu không có search => lấy tất cả
            productResponse = productService.getAllProducts(
                    pageNumber == 0 ? pageNumber : pageNumber - 1,
                    pageSize,
                    "id".equals(sortBy) ? "productId" : sortBy,
                    sortOrder);
        }

        return new ResponseEntity<>(productResponse, HttpStatus.OK);
    }

    @GetMapping("/public/categories/{categoryId}/products")
    public ResponseEntity<ProductResponse> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(name = "search", required = false) String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR) String sortOrder) {

        // ✅ ép kiểu rõ ràng để không bị type mismatch
        Integer pageIndex = (pageNumber == 0) ? 0 : pageNumber - 1;

        ProductResponse productResponse = productService.searchByCategory(
                categoryId,
                keyword,
                pageIndex,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);

        return ResponseEntity.ok(productResponse);
    }

    // ✅ Tìm kiếm sản phẩm theo từ khóa
    @GetMapping("/public/products/keyword/{keyword}")
    public ResponseEntity<Map<String, Object>> getProductsByKeyword(
            @PathVariable String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_PRODUCTS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder,
            @RequestParam(name = "categoryId", defaultValue = "0", required = false) Long categoryId) {

        ProductResponse productResponse = productService.searchProductByKeyword(
                keyword,
                categoryId,
                pageNumber == 0 ? pageNumber : pageNumber - 1,
                pageSize,
                "id".equals(sortBy) ? "productId" : sortBy,
                sortOrder);

        // ✅ Gói dữ liệu lại cho React Admin
        Map<String, Object> response = new HashMap<>();
        response.put("data", productResponse.getContent());
        response.put("total", productResponse.getTotalElements());

        return ResponseEntity.ok(response);
    }

    // ✅ Lấy ảnh sản phẩm
    @GetMapping("/public/products/image/{fileName}")
    public ResponseEntity<InputStreamResource> getImage(@PathVariable String fileName) throws FileNotFoundException {
        InputStream imageStream = productService.getProductImage(fileName);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.IMAGE_PNG);
        headers.setContentDispositionFormData("inline", fileName);

        return new ResponseEntity<>(new InputStreamResource(imageStream), headers, HttpStatus.OK);
    }

    // ✅ Cập nhật sản phẩm
    @PutMapping("/admin/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @RequestBody Product product,
            @PathVariable Long productId) {

        ProductDTO updatedProduct = productService.updateProduct(productId, product);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    // ✅ Cập nhật ảnh sản phẩm
    @PutMapping("/admin/products/{productId}/image")
    public ResponseEntity<ProductDTO> updateProductImage(
            @PathVariable Long productId,
            @RequestParam("image") MultipartFile image) throws IOException {

        ProductDTO updatedProduct = productService.updateProductImage(productId, image);
        return new ResponseEntity<>(updatedProduct, HttpStatus.OK);
    }

    // ✅ Xóa sản phẩm
    @DeleteMapping("/admin/products/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId) {
        String status = productService.deleteProduct(productId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
