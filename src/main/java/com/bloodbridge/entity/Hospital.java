package com.bloodbridge.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hospitals")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // it autogenerates the value for id

    // Wrapper classes can represent "not yet assigned" with null
    // which is better than long or int - they initially say 0
    private Long id;

    private String hospitalName;

    private String contactNumber;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;

    private String city;

    private String address;

    @Column(unique = true)
    private String registrationNumber;

}
