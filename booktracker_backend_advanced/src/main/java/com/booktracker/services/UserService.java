package com.booktracker.services;

import com.booktracker.entity.User;
import com.booktracker.model.dto.UpdateProfileRequest;
import com.booktracker.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
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
}