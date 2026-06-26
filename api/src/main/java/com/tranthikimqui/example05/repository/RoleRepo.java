package com.tranthikimqui.example05.repository;

import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;
import com.tranthikimqui.example05.entity.Role;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {

}
