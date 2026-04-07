package com.booktracker.controller;

import com.booktracker.model.dto.LoginRequest;
import com.booktracker.entity.User;
import com.booktracker.model.dto.RegisterRequest;
import com.booktracker.services.AuthService;

import jakarta.mail.MessagingException;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("Username: " + request.getUsername());
        return authService.loginService(request);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request)
            throws MessagingException, UnsupportedEncodingException {
        System.out.println("REGISTER API CALLED");
        System.out.println("Username: " + request.getUsername());
        System.out.println("Email: " + request.getEmail());
        return authService.registerService(request);
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token)
            throws MessagingException, UnsupportedEncodingException {
        return authService.verifyAccountService(token);
    }
}