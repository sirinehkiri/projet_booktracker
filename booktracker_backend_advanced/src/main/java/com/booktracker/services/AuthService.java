package com.booktracker.services;

import com.booktracker.config.JwtResponse;
import com.booktracker.model.dto.LoginRequest;
import com.booktracker.entity.User;
import com.booktracker.entity.VerificationToken;
import com.booktracker.model.dto.RegisterRequest;
import com.booktracker.repository.UserRepository;
import com.booktracker.repository.VerificationTokenRepository;
import com.booktracker.security.JwtUtil;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.UnsupportedEncodingException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    //login
    public ResponseEntity<?> loginService(LoginRequest loginRequest) {
        try {
            // Authentification
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String username = authentication.getName();
            List<String> roles = authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

            // Récupération utilisateur
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

            // Vérification email
            if (!user.isEmailVerified()) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Veuillez vérifier votre email !"));
            }

            // Génération token
            String token = JwtUtil.generateToken(username, roles);
            return ResponseEntity.ok(Map.of(
                    "message", "Connexion réussie",
                    "token", token,
                    "username", username,
                    "roles", roles,
                    "id",user.getId()
            ));

        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Nom d'utilisateur ou mot de passe incorrect"));
        }
    }

    // ================= REGISTER =================
    public ResponseEntity registerService(RegisterRequest request)
            throws MessagingException, UnsupportedEncodingException {
        System.out.println("Username: " + request.getUsername());
        System.out.println("Email: " + request.getEmail());
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Username already exists"));
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "Email already exists"));
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // rôle par défaut
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        user.setEmailVerified(false);
        System.out.println("Before save");
        userRepository.save(user);
        System.out.println("After save");

        // Token
        String token = UUID.randomUUID().toString();

        VerificationToken vToken = new VerificationToken();
        vToken.setToken(token);
        vToken.setUser(user);
        vToken.setExpiryDate(LocalDateTime.now().plusHours(24));

        tokenRepository.save(vToken);

        String link = "http://localhost:8081/auth/verify?token=" + token;

        emailService.sendEmail(
                user.getEmail(),
                "Vérification Email",
                "<h3>Bonjour " + user.getUsername() + "</h3>" +
                        "<p>Cliquez ici pour activer votre compte :</p>" +
                        "<a href='" + link + "'>Activer</a>"
        );

        return ResponseEntity.ok(Map.of("message", "Inscription réussie. Vérifiez votre email."));
    }

    // ================= VERIFY =================
    public ResponseEntity<?> verifyAccountService(String token)
            throws MessagingException, UnsupportedEncodingException {

        VerificationToken vToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Token invalide"));

        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Lien expiré !");
        }

        User user = vToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        emailService.sendEmail(
                user.getEmail(),
                "Compte activé",
                "Votre compte est maintenant actif 🎉"
        );

        return ResponseEntity.ok("Compte activé !");
    }

}