package com.tranthikimqui.example05.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.tranthikimqui.example05.entity.User;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {

    // Lấy tất cả User có địa chỉ cụ thể
    @Query("SELECT DISTINCT u FROM User u JOIN FETCH u.addresses a WHERE a.addressId = :addressId")
    List<User> findByAddresses(Long addressId);

    // Tìm User theo email
    Optional<User> findByEmail(String email);
}
