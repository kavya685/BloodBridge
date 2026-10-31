package com.bloodbridge.security;

import com.bloodbridge.entity.Admin;
import com.bloodbridge.entity.Donor;
import com.bloodbridge.entity.Hospital;
import com.bloodbridge.repository.AdminRepository;
import com.bloodbridge.repository.DonorRepository;
import com.bloodbridge.repository.HospitalRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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
        List<GrantedAuthority> authorities = new ArrayList<>();
        String password = null;

        Optional<Donor> donor = donorRepository.findByEmail(username);
        if (donor.isPresent()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_DONOR"));
            password = donor.get().getPassword();
        }

        Optional<Hospital> hospital = hospitalRepository.findByEmail(username);
        if (hospital.isPresent()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_HOSPITAL"));
            if (password == null) {
                password = hospital.get().getPassword();
            }
        }

        Optional<Admin> admin = adminRepository.findByEmail(username);
        if (admin.isPresent()) {
            if (Boolean.TRUE.equals(admin.get().getActive())) {
                authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
                if (password == null) {
                    password = admin.get().getPassword();
                }
            }
        }

        if (authorities.isEmpty() || password == null) {
            throw new UsernameNotFoundException("User not found with email: " + username);
        }

        return new User(username, password, authorities);
    }
}
