package com.booktracker.services;

import com.booktracker.entity.User;
import com.booktracker.model.dto.ChangePasswordRequest;
import com.booktracker.model.dto.UpdateProfileRequest;
import com.booktracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User updateProfile(
            String currentUsername,
            UpdateProfileRequest request,
            MultipartFile image
    ) throws IOException {

        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        // Update username
        if (request.getUsername() != null &&
                !request.getUsername().isEmpty()) {

            user.setUsername(request.getUsername());
        }

        // Upload image
        if (image != null && !image.isEmpty()) {

            String uploadDir = "uploads/";

            Files.createDirectories(Paths.get(uploadDir));

            String fileName = UUID.randomUUID() + "_"
                    + image.getOriginalFilename();

            Path path = Paths.get(uploadDir + fileName);

            Files.write(path, image.getBytes());

            user.setImage(fileName);
        }

        return userRepository.save(user);
    }


    public void changePassword(
            String username,
            ChangePasswordRequest request
    ) {
        System.out.println(username);

        User user = userRepository
                .findByUsername(username)
                .orElseThrow();

        if (!passwordEncoder.matches(
                request.getCurrentPassword(),
                user.getPassword()
        )) {

            throw new RuntimeException(
                    "Current password incorrect"
            );
        }

        user.setPassword(

                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        userRepository.save(user);
    }
}