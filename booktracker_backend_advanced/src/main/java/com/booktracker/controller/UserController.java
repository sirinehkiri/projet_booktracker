package com.booktracker.controller;

import com.booktracker.entity.User;
import com.booktracker.model.dto.UpdateProfileRequest;
import com.booktracker.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            Authentication authentication,
            @RequestPart("data") UpdateProfileRequest request,
            @RequestPart(value = "image", required = false)
            MultipartFile image
    ) throws IOException {
        System.out.println(authentication);
        System.out.println(authentication.getName());
        User connectedUser = (User) authentication.getPrincipal();

        String currentUsername = connectedUser.getUsername();
        System.out.println(currentUsername);

        User updatedUser = userService.updateProfile(
                currentUsername,
                request,
                image
        );

        Map<String, Object> response = new HashMap<>();

        response.put("message", "Profil mis à jour");
        response.put("username", updatedUser.getUsername());
        response.put("image", updatedUser.getImage());

        return ResponseEntity.ok(response);
    }
}