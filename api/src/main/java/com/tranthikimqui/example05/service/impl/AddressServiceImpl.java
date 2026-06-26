package com.tranthikimqui.example05.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tranthikimqui.example05.entity.Address;
import com.tranthikimqui.example05.entity.User;
import com.tranthikimqui.example05.exceptions.APIException;
import com.tranthikimqui.example05.exceptions.ResourceNotFoundException;
import com.tranthikimqui.example05.payloads.AddressDTO;
import com.tranthikimqui.example05.repository.AddressRepo;
import com.tranthikimqui.example05.repository.UserRepo;
import com.tranthikimqui.example05.service.AddressService;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class AddressServiceImpl implements AddressService {

    @Autowired
    private AddressRepo addressRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public AddressDTO createAddress(AddressDTO addressDTO) {
        Address existingAddress = addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(
                addressDTO.getCountry(), addressDTO.getState(), addressDTO.getCity(),
                addressDTO.getPincode(), addressDTO.getStreet(), addressDTO.getBuildingName());

        if (existingAddress != null) {
            throw new APIException("Address already exists with addressId: " + existingAddress.getAddressId());
        }

        Address address = modelMapper.map(addressDTO, Address.class);
        Address savedAddress = addressRepo.save(address);
        return modelMapper.map(savedAddress, AddressDTO.class);
    }

    @Override
    public List<AddressDTO> getAddresses() {
        List<Address> addresses = addressRepo.findAll();
        return addresses.stream()
                .map(address -> modelMapper.map(address, AddressDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public AddressDTO getAddress(Long addressId) {
        Address address = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));
        return modelMapper.map(address, AddressDTO.class);
    }

    @Override
    public AddressDTO updateAddress(Long addressId, Address newAddress) {
        Address addressFromDB = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        Address existingAddress = addressRepo.findByCountryAndStateAndCityAndPincodeAndStreetAndBuildingName(
                newAddress.getCountry(), newAddress.getState(), newAddress.getCity(),
                newAddress.getPincode(), newAddress.getStreet(), newAddress.getBuildingName());

        if (existingAddress != null && !existingAddress.getAddressId().equals(addressId)) {
            throw new APIException("Address already exists!");
        }

        addressFromDB.setCountry(newAddress.getCountry());
        addressFromDB.setState(newAddress.getState());
        addressFromDB.setCity(newAddress.getCity());
        addressFromDB.setPincode(newAddress.getPincode());
        addressFromDB.setStreet(newAddress.getStreet());
        addressFromDB.setBuildingName(newAddress.getBuildingName());

        Address updatedAddress = addressRepo.save(addressFromDB);
        return modelMapper.map(updatedAddress, AddressDTO.class);
    }

    @Override
    public String deleteAddress(Long addressId) {
        Address addressFromDB = addressRepo.findById(addressId)
                .orElseThrow(() -> new ResourceNotFoundException("Address", "addressId", addressId));

        // Gỡ liên kết address khỏi tất cả user đang dùng
        List<User> users = userRepo.findByAddresses(addressId);
        users.forEach(user -> {
            user.getAddresses().remove(addressFromDB);
            userRepo.save(user);
        });

        addressRepo.delete(addressFromDB);
        return "Address deleted successfully with addressId: " + addressId;
    }
}
