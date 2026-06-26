package com.tranthikimqui.example05.config;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.tranthikimqui.example05.entity.User;

public class UserInfoConfig implements UserDetails {

    private String email;
    private String password;
    private List<GrantedAuthority> authorities;

    public UserInfoConfig(User user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
        // map roles → SimpleGrantedAuthority
        this.authorities = user.getRoles().stream()
                .filter(role -> role.getRoleName() != null && !role.getRoleName().isEmpty()) // loại bỏ role rỗng
                .map(role -> {
                    String roleName = role.getRoleName();
                    if (!roleName.startsWith("ROLE_")) {
                        roleName = "ROLE_" + roleName; // chuẩn hóa
                    }
                    return new SimpleGrantedAuthority(roleName);
                })
                .collect(Collectors.toList());

    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
