package com.tranthikimqui.example05.service.impl;

import java.util.HashSet;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.tranthikimqui.example05.config.AppConstants;
import com.tranthikimqui.example05.entity.Address;
import com.tranthikimqui.example05.entity.Role;
import com.tranthikimqui.example05.entity.User;
import com.tranthikimqui.example05.exceptions.APIException;
import com.tranthikimqui.example05.exceptions.ResourceNotFoundException;
import com.tranthikimqui.example05.payloads.AddressDTO;
import com.tranthikimqui.example05.payloads.UserDTO;
import com.tranthikimqui.example05.payloads.UserResponse;
import com.tranthikimqui.example05.repository.AddressRepo;
import com.tranthikimqui.example05.repository.RoleRepo;
import com.tranthikimqui.example05.repository.UserRepo;
import com.tranthikimqui.example05.service.UserService;
import com.tranthikimqui.example05.entity.Cart;
import com.tranthikimqui.example05.payloads.CartDTO;
import com.tranthikimqui.example05.payloads.ProductDTO;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private RoleRepo roleRepo;

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    @Transactional
    public UserDTO registerUser(UserDTO userDTO) {
        try {
            // 1️⃣ Tạo User thủ công, không map roles
            User user = new User();
            user.setFirstName(userDTO.getFirstName());
            user.setLastName(userDTO.getLastName());
            user.setEmail(userDTO.getEmail());
            user.setMobileNumber(userDTO.getMobileNumber());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));

            // 2️⃣ Tạo Cart và gán
            Cart cart = new Cart();
            cart.setUser(user);
            user.setCart(cart);

            user.setRoles(new HashSet<>()); // 🧩 thêm dòng này

            // 3️⃣ Lấy Role từ DB (managed entity)
            Role role = roleRepo.findById(AppConstants.USER_ID)
                    .orElseThrow(() -> new APIException("USER role not found"));
            user.getRoles().add(role); // ✅ Hibernate chỉ insert vào bảng trung gian

            // 4️⃣ Xử lý Address
            AddressDTO addrDTO = userDTO.getAddress();
            Address address = addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(
                    addrDTO.getCountry(), addrDTO.getState(), addrDTO.getCity(),
                    addrDTO.getPincode(), addrDTO.getStreet(), addrDTO.getBuildingName());

            if (address == null) {
                address = new Address(
                        addrDTO.getCountry(), addrDTO.getState(),
                        addrDTO.getCity(), addrDTO.getPincode(),
                        addrDTO.getStreet(), addrDTO.getBuildingName());
                address = addressRepo.save(address);
            }
            user.setAddresses(List.of(address));

            // 5️⃣ Lưu User
            User savedUser = userRepo.save(user);

            System.out.println("User ID = " + savedUser.getUserId());

            if (savedUser.getCart() != null) {
                System.out.println("Cart ID = " + savedUser.getCart().getCartId());
            } else {
                System.out.println("Cart is NULL");
            }

            // 6️⃣ Trả về DTO
            UserDTO resultDTO = new UserDTO();
            resultDTO.setUserId(savedUser.getUserId());
            resultDTO.setFirstName(savedUser.getFirstName());
            resultDTO.setLastName(savedUser.getLastName());
            resultDTO.setEmail(savedUser.getEmail());
            resultDTO.setMobileNumber(savedUser.getMobileNumber());
            resultDTO.setAddress(addrDTO); // map thủ công
            return resultDTO;

        } catch (DataIntegrityViolationException e) {
            throw new APIException("User already exists with emailId: " + userDTO.getEmail());
        }
    }

    @Override
    public UserResponse getAllUsers(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sort = sortOrder.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        Page<User> pageUsers = userRepo.findAll(pageable);
        List<User> users = pageUsers.getContent();

        if (users.isEmpty()) {
            throw new APIException("No User exists !!!");
        }

        List<UserDTO> userDTOs = users.stream().map(user -> {
            UserDTO dto = modelMapper.map(user, UserDTO.class);
            if (!user.getAddresses().isEmpty()) {
                dto.setAddress(modelMapper.map(user.getAddresses().get(0), AddressDTO.class));
            }
            return dto;
        }).collect(Collectors.toList());

        UserResponse response = new UserResponse();
        response.setContent(userDTOs);
        response.setPageNumber(pageUsers.getNumber());
        response.setPageSize(pageUsers.getSize());
        response.setTotalElements(pageUsers.getTotalElements());
        response.setTotalPages(pageUsers.getTotalPages());
        response.setLastPage(pageUsers.isLast());

        return response;
    }

    @Override
    public UserDTO getUserById(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        UserDTO dto = modelMapper.map(user, UserDTO.class);
        if (!user.getAddresses().isEmpty()) {
            dto.setAddress(modelMapper.map(user.getAddresses().get(0), AddressDTO.class));
        }
        return dto;
    }

    @Override
    public UserDTO updateUser(Long userId, UserDTO userDTO) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setMobileNumber(userDTO.getMobileNumber());
        user.setEmail(userDTO.getEmail());

        // ✅ Chỉ mã hóa và cập nhật nếu có mật khẩu mới
        if (userDTO.getPassword() != null && !userDTO.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        }

        if (userDTO.getAddress() != null) {
            AddressDTO addrDto = userDTO.getAddress();
            Address address = addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(
                    addrDto.getCountry(), addrDto.getState(), addrDto.getCity(),
                    addrDto.getPincode(), addrDto.getStreet(), addrDto.getBuildingName());

            if (address == null) {
                address = new Address(addrDto.getCountry(), addrDto.getState(), addrDto.getCity(),
                        addrDto.getPincode(), addrDto.getStreet(), addrDto.getBuildingName());
                address = addressRepo.save(address);
            }

            user.setAddresses(List.of(address));
        }

        user = userRepo.save(user);

        UserDTO response = modelMapper.map(user, UserDTO.class);
        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            response.setAddress(modelMapper.map(user.getAddresses().get(0), AddressDTO.class));
        }

        return response;
    }

    @Override
    public String deleteUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        userRepo.delete(user);
        return "User with userId " + userId + " deleted successfully!!!";
    }

    @Override
    public UserDTO findByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        UserDTO userDTO = modelMapper.map(user, UserDTO.class);
        if (user.getAddresses() != null && !user.getAddresses().isEmpty()) {
            userDTO.setAddress(modelMapper.map(user.getAddresses().stream().findFirst().get(), AddressDTO.class));
        }
        if (user.getCart() != null) {
            CartDTO cartDTO = modelMapper.map(user.getCart(), CartDTO.class);
            List<ProductDTO> products = user.getCart().getCartItems().stream()
                    .map(item -> modelMapper.map(item.getProduct(), ProductDTO.class))
                    .collect(Collectors.toList());
            cartDTO.setProducts(products);
            userDTO.setCart(cartDTO);
        }
        return userDTO;
    }

    @Override
    public User getUserByEmail(String email) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getUserByEmail'");
    }

    @Override
    public User getUserEntityByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    // Method implemented above
}
