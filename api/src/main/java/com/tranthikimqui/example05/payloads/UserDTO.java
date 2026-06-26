package com.tranthikimqui.example05.payloads;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

import com.tranthikimqui.example05.entity.User;

import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    public UserDTO(User user) {
        // TODO Auto-generated constructor stub
    }

    private Long userId;
    private String firstName;
    private String lastName;
    private String mobileNumber;
    private String email;
    private String password;
    private AddressDTO address;
    private CartDTO cart;
    private Set<String> roles; // ví dụ: ["ROLE_USER"]

    // getters & setters
    public String getUserByEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Set<String> getRole() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }

}
