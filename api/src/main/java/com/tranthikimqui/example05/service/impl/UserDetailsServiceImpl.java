package com.tranthikimqui.example05.service.impl;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tranthikimqui.example05.config.UserInfoConfig;
import com.tranthikimqui.example05.entity.User;
import com.tranthikimqui.example05.repository.UserRepo;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> user = userRepo.findByEmail(username);

        if (user.isPresent()) {
            System.out.println("✅ Email: " + user.get().getEmail());
            System.out.println("✅ Password từ DB: " + user.get().getPassword());
            System.out.println("✅ Roles: " + user.get().getRoles());
            return new UserInfoConfig(user.get());
        } else {
            throw new UsernameNotFoundException("❌ User not found with email: " + username);
        }
    }

}
