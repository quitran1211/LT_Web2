package com.tranthikimqui.example05.controller;

import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.tranthikimqui.example05.exceptions.UserNotFoundException;
import com.tranthikimqui.example05.payloads.LoginCredentials;
import com.tranthikimqui.example05.payloads.UserDTO;
import com.tranthikimqui.example05.security.JWTUtil;
import com.tranthikimqui.example05.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api")
@SecurityRequirement(name = "E-Commerce Application")
public class AuthController {
        @Autowired
        private UserService userService;

        @Autowired
        private JWTUtil jwtUtil;

        @Autowired
        private AuthenticationManager authenticationManager;

        @Autowired
        private PasswordEncoder passwordEncoder;

        // -------------------- REGISTER --------------------
        @PostMapping("/register")
        public ResponseEntity<Map<String, Object>> registerHandler(@Valid @RequestBody UserDTO user)
                        throws UserNotFoundException {

                // Đăng ký người dùng
                UserDTO userDTO = userService.registerUser(user);
                System.out.println("===== REGISTER =====");
                System.out.println("EMAIL = " + user.getEmail());
                System.out.println("PASS  = [" + user.getPassword() + "]");

                // Tạo JWT token
                String token = jwtUtil.generateToken(
                                userDTO.getUserByEmail(),
                                Collections.emptySet());
                // Trả về token kèm HTTP status CREATED
                return new ResponseEntity<>(
                                Collections.singletonMap("jwt-token", token),
                                HttpStatus.CREATED);
        }

        // -------------------- LOGIN --------------------
        @PostMapping("/login")
        public ResponseEntity<?> loginHandler(@Valid @RequestBody LoginCredentials credentials) {

                UserDTO userDTO = userService.findByEmail(credentials.getEmail());

                System.out.println("Input email = " + credentials.getEmail());
                System.out.println("Input pass  = " + credentials.getPassword());
                System.out.println("DB pass     = " + userDTO.getPassword());

                boolean match = passwordEncoder.matches(
                                credentials.getPassword(),
                                userDTO.getPassword());

                System.out.println("MATCH = " + match);

                authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                credentials.getEmail(),
                                                credentials.getPassword()));

                // ----------------------------
                // Lấy roles dạng String cho JWT
                // ----------------------------
                Set<String> roles;
                if (!userDTO.getRoles().isEmpty()) {
                        Object firstRole = userDTO.getRoles().iterator().next();
                        if (firstRole instanceof String) {
                                roles = userDTO.getRoles().stream()
                                                .map(r -> (String) ((Object) r))
                                                .collect(Collectors.toSet());
                        } else {
                                roles = userDTO.getRoles().stream()
                                                .map(r -> {
                                                        try {
                                                                return (String) r.getClass().getMethod("getRoleName")
                                                                                .invoke(r);
                                                        } catch (Exception e) {
                                                                throw new RuntimeException(
                                                                                "Cannot get roleName from Role object",
                                                                                e);
                                                        }
                                                })
                                                .collect(Collectors.toSet());
                        }
                } else {
                        roles = Set.of();
                }

                // Sinh JWT
                String token = jwtUtil.generateToken(userDTO.getUserByEmail(), roles);

                // Log debug
                System.out.println("User logged in: " + userDTO.getUserByEmail());
                System.out.println("Roles: " + roles);
                System.out.println("JWT: " + token);

                return new ResponseEntity<>(
                                Collections.singletonMap("jwt-token", token),
                                HttpStatus.OK);
        }
}
