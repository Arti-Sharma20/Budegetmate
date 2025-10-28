package com.budgetmate.controller;

import com.budgetmate.dto.LoginRequest;
import com.budgetmate.dto.UserDTO;
import com.budgetmate.dto.UserRegistrationDTO;
import com.budgetmate.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserRegistrationDTO dto) {
        UserDTO createdUser = userService.registerUser(dto);
        return ResponseEntity.ok(createdUser);
    }
    @PostMapping("/login")
    public ResponseEntity<UserDTO> login(@RequestBody LoginRequest request) {
        UserDTO user = userService.login(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(user);
    }}
