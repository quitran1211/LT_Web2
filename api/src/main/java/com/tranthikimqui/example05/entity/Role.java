package com.tranthikimqui.example05.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "roles")
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "role_id")
    private Long id;

    @Column(name = "role_name")
    private String roleName; // đổi tên field cho chuẩn camelCase
    // getter

    public String getRoleName() {
        return roleName;
    }

    public void setRoleId(Long adminId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setRoleId'");
    }
}
