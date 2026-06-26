package com.tranthikimqui.example05.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingPathVariableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.tranthikimqui.example05.payloads.APIResponse;

import jakarta.validation.ConstraintViolationException;

@RestControllerAdvice
public class MyGlobalExceptionHandler {

    // Xử lý lỗi không tìm thấy tài nguyên
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<APIResponse> handleResourceNotFound(ResourceNotFoundException e) {
        String message = e.getMessage();
        APIResponse res = new APIResponse(message, false);
        return new ResponseEntity<>(res, HttpStatus.NOT_FOUND);
    }

    // Xử lý lỗi API tùy chỉnh
    @ExceptionHandler(APIException.class)
    public ResponseEntity<APIResponse> handleAPIException(APIException e) {
        String message = e.getMessage();
        APIResponse res = new APIResponse(message, false);
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi validate dữ liệu trong @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationErrors(MethodArgumentNotValidException e) {
        Map<String, String> res = new HashMap<>();
        e.getBindingResult().getAllErrors().forEach(err -> {
            String fieldName = ((FieldError) err).getField();
            String message = err.getDefaultMessage();
            res.put(fieldName, message);
        });
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi validate trong @PathVariable, @RequestParam
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, String>> handleConstraintViolation(ConstraintViolationException e) {
        Map<String, String> res = new HashMap<>();
        e.getConstraintViolations().forEach(violation -> {
            String fieldName = violation.getPropertyPath().toString();
            String message = violation.getMessage();
            res.put(fieldName, message);
        });
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi xác thực (authentication)
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException e) {
        return new ResponseEntity<>(e.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    // Xử lý lỗi thiếu path variable
    @ExceptionHandler(MissingPathVariableException.class)
    public ResponseEntity<APIResponse> handleMissingPathVariable(MissingPathVariableException e) {
        APIResponse res = new APIResponse(e.getMessage(), false);
        return new ResponseEntity<>(res, HttpStatus.BAD_REQUEST);
    }

    // Xử lý lỗi ràng buộc dữ liệu database (ví dụ: trùng key, foreign key, v.v.)
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<APIResponse> handleDataIntegrityViolation(DataIntegrityViolationException e) {
        APIResponse res = new APIResponse("Data integrity violation: " + e.getMessage(), false);
        return new ResponseEntity<>(res, HttpStatus.CONFLICT);
    }

    // Xử lý lỗi tổng quát (fallback)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handleGenericException(Exception e) {
        APIResponse res = new APIResponse("Unexpected error: " + e.getMessage(), false);
        return new ResponseEntity<>(res, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
