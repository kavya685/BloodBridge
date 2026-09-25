package com.bloodbridge.security;

import com.bloodbridge.entity.Admin;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.repository.AdminRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.HospitalRepository;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final DonorRepository donorRepository;
    private final HospitalRepository hospitalRepository;
    private final AdminRepository adminRepository;

    public CustomUserDetailsService(DonorRepository donorRepository,
                                    HospitalRepository hospitalRepository,
                                    AdminRepository adminRepository) {
        this.donorRepository = donorRepository;
        this.hospitalRepository = hospitalRepository;
        this.adminRepository = adminRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {
        Optional<Donor> donor = donorRepository.findByEmail(username);
        if (donor.isPresent()) {
            return User.builder()
                    .username(donor.get().getEmail())
                    .password(donor.get().getPassword())
                    .authorities("ROLE_DONOR")
                    .build();
        }

        Optional<Hospital> hospital = hospitalRepository.findByEmail(username);
        if (hospital.isPresent()) {
            return User.builder()
                    .username(hospital.get().getEmail())
                    .password(hospital.get().getPassword())
                    .authorities("ROLE_HOSPITAL")
                    .build();
        }

        Optional<Admin> admin = adminRepository.findByEmail(username);

        if (admin.isPresent()) {

            if (!Boolean.TRUE.equals(admin.get().getActive())) {
                throw new UsernameNotFoundException(
                        "Admin account is disabled"
                );
            }

            return User.builder()
                    .username(admin.get().getEmail())
                    .password(admin.get().getPassword())
                    .authorities("ROLE_ADMIN")
                    .build();
        }

        throw new UsernameNotFoundException("User not found with email: " + username);
    }
}
