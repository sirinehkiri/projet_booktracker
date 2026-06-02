package com.booktracker.controller;

import com.booktracker.entity.User;
import com.booktracker.model.dto.ChangePasswordRequest;
import com.booktracker.model.dto.UpdateProfileRequest;
import com.booktracker.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.booktracker.security.JwtUtil;
import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost")
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

        String token = JwtUtil.generateToken(

                updatedUser.getUsername(),

                List.of(
                        updatedUser.getRole()
                )
        );
        Map<String, Object> response = new HashMap<>();

        response.put("message", "Profil mis à jour");
        response.put("username", updatedUser.getUsername());
        response.put("image", updatedUser.getImage());
        response.put(
                "token",
                token
        );

        return ResponseEntity.ok(response);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @RequestBody ChangePasswordRequest request,
            Authentication authentication
    ) {
        User connectedUser = (User) authentication.getPrincipal();

        String currentUsername = connectedUser.getUsername();
        System.out.println(currentUsername);

        userService.changePassword(currentUsername, request);
        return ResponseEntity.ok().build();
    }
}