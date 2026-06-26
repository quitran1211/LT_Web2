package com.tranthikimqui.example05.payloads;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RoleDTO {
    private Long id;
    private String roleName; // "ROLE_USER" hoặc "ROLE_ADMIN"
}
