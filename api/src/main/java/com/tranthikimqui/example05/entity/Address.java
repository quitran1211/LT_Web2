package com.tranthikimqui.example05.entity;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "addresses")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Address {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long addressId;

    @NotBlank(message = "Street name must not be blank")
    @Size(min = 5, message = "Street name must contain at least 5 characters")
    private String street;

    @NotBlank(message = "Building name must not be blank")
    @Size(min = 5, message = "Building name must contain at least 5 characters")
    private String buildingName;

    @NotBlank(message = "City name must not be blank")
    @Size(min = 4, message = "City name must contain at least 4 characters")
    private String city;

    @NotBlank(message = "State name must not be blank")
    @Size(min = 2, message = "State name must contain at least 2 characters")
    private String state;

    @NotBlank(message = "Country name must not be blank")
    @Size(min = 2, message = "Country name must contain at least 2 characters")
    private String country;

    @NotBlank(message = "Pincode must not be blank")
    @Size(min = 6, message = "Pincode must contain at least 6 characters")
    private String pincode;

    @ManyToMany(mappedBy = "addresses")
    private List<User> users = new ArrayList<>();

    // Convenience constructor
    public Address(String country, String state, String city, String pincode, String street, String buildingName) {
        this.country = country;
        this.state = state;
        this.city = city;
        this.pincode = pincode;
        this.street = street;
        this.buildingName = buildingName;
    }
}
