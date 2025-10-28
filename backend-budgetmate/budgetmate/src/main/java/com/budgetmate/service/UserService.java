package com.budgetmate.service;
import com.budgetmate.dto.UserDTO;
import com.budgetmate.dto.UserRegistrationDTO;
import com.budgetmate.model.User;
import com.budgetmate.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public UserDTO registerUser(UserRegistrationDTO dto) {
        // Check if email already exists
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        User user = User.builder()
                .username(dto.getUsername())
                .email(dto.getEmail())
                .password(dto.getPassword()) // TODO: hash in future
                .createdAt(LocalDateTime.now())
                .build();

        User saved = userRepository.save(user);

        return new UserDTO(saved.getId(), saved.getUsername(), saved.getEmail());
    }

    public UserDTO login(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent() && userOpt.get().getPassword().equals(password)) {
            User user = userOpt.get();
            return new UserDTO(user.getId(), user.getUsername(), user.getEmail());
        } else {
            throw new RuntimeException("Invalid email or password");
        }
    }
}
