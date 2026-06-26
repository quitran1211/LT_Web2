package com.tranthikimqui.example05.service;

import com.tranthikimqui.example05.entity.User;
import com.tranthikimqui.example05.payloads.UserDTO;
import com.tranthikimqui.example05.payloads.UserResponse;

public interface UserService {

    UserDTO registerUser(UserDTO userDTO);

    UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);

    UserDTO getUserById(Long userId);

    UserDTO updateUser(Long userId, UserDTO userDTO);

    String deleteUser(Long userId);

    UserDTO findByEmail(String email);

    // 👇 Thêm dòng này để khớp với UserServiceImpl
    User getUserByEmail(String email);

    User getUserEntityByEmail(String email);

}
