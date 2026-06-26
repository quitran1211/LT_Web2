package com.tranthikimqui.example05.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.tranthikimqui.example05.config.AppConstants;
import com.tranthikimqui.example05.payloads.OrderDTO;
import com.tranthikimqui.example05.payloads.OrderResponse;
import com.tranthikimqui.example05.service.OrderService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class OrderController {

    @Autowired
    private OrderService orderService;

    // ✅ Đặt hàng
    @PostMapping("/public/users/{emailId}/carts/{cartId}/payments/{paymentMethod}/order")
    public ResponseEntity<OrderDTO> orderProducts(
            @PathVariable String emailId,
            @PathVariable Long cartId,
            @PathVariable String paymentMethod) {

        OrderDTO order = orderService.placeOrder(emailId, cartId, paymentMethod);
        return new ResponseEntity<>(order, HttpStatus.CREATED);
    }

    // ✅ Lấy tất cả đơn hàng (cho admin)
    @GetMapping("/admin/orders")
    public ResponseEntity<OrderResponse> getAllOrders(
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_ORDERS_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_DIR, required = false) String sortOrder) {

        OrderResponse orderResponse = orderService.getAllOrders(pageNumber, pageSize, sortBy, sortOrder);
        return new ResponseEntity<>(orderResponse, HttpStatus.OK);
    }

    // ✅ Lấy tất cả đơn hàng theo người dùng
    @GetMapping("/public/users/{emailId}/orders")
    public ResponseEntity<List<OrderDTO>> getOrdersByUser(@PathVariable String emailId) {
        List<OrderDTO> orders = orderService.getOrdersByUser(emailId);
        return new ResponseEntity<>(orders, HttpStatus.OK);
    }

    // ✅ Lấy 1 đơn hàng cụ thể theo người dùng
    @GetMapping("/public/users/{emailId}/orders/{orderId}")
    public ResponseEntity<OrderDTO> getOrderByUser(
            @PathVariable String emailId,
            @PathVariable Long orderId) {

        OrderDTO order = orderService.getOrder(emailId, orderId);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }

    // ✅ Cập nhật trạng thái đơn hàng (cho admin)
    @PutMapping("/admin/users/{emailId}/orders/{orderId}/orderStatus/{orderStatus}")
    public ResponseEntity<OrderDTO> updateOrderByUser(
            @PathVariable String emailId,
            @PathVariable Long orderId,
            @PathVariable String orderStatus) {

        OrderDTO order = orderService.updateOrder(emailId, orderId, orderStatus);
        return new ResponseEntity<>(order, HttpStatus.OK);
    }
}
