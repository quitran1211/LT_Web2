package com.tranthikimqui.example05.payloads;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.persistence.Column;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginCredentials {
    @Email
    @Column(unique = true, nullable = false)
    private String email;
    private String password;
}
