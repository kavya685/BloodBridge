package com.bloodbridge.config;

import com.bloodbridge.security.JwtFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // ---------- Public ----------
                        .requestMatchers(
                                "/api/donors",
                                "/api/donors/login",
                                "/api/hospitals",
                                "/api/hospitals/login"
                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blood-requests",
                                "/api/blood-requests/*"
                        ).permitAll()

                        // ---------- Hospital ----------
                        .requestMatchers(
                                "/api/hospitals/me",
                                "/api/blood-requests/my"
                        ).hasRole("HOSPITAL")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/blood-requests"
                        ).hasRole("HOSPITAL")

                        .requestMatchers(
                                "/api/donation-applications/accept/**",
                                "/api/donation-applications/reject/**"
                        ).hasRole("HOSPITAL")

                        // ---------- Donor ----------
                        .requestMatchers(
                                "/api/donors/me",
                                "/api/donation-applications/my"
                        ).hasRole("DONOR")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/donation-applications"
                        ).hasRole("DONOR")

                        // ---------- Everything else ----------
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
