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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;

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
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // ---------- Public ----------
                        .requestMatchers(
                                "/api/donors",
                                "/api/donors/login",
                                "/api/hospitals",
                                "/api/hospitals/login"
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

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/blood-requests/**"
                        ).hasRole("HOSPITAL")

                        // ---------- Donor ----------
                        .requestMatchers(
                                "/api/donors/me",
                                "/api/donation-applications/my"
                        ).hasRole("DONOR")

                        .requestMatchers(
                                HttpMethod.GET,
                                "/api/blood-requests",
                                "/api/blood-requests/*"
                        ).hasRole("DONOR")


                        .requestMatchers(
                                org.springframework.http.HttpMethod.POST,
                                "/api/donation-applications"
                        ).hasRole("DONOR")

                        .requestMatchers(
                                org.springframework.http.HttpMethod.GET,
                                "/api/donation-applications/applications/*"
                        ).hasRole("DONOR")

                        .requestMatchers(
                                HttpMethod.DELETE,
                                "/api/donation-applications/**"
                        ).hasRole("DONOR")

                        // ---------- Everything else ----------
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:5173"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
