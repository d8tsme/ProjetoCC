package com.bibliotech.api.controllers;

import com.bibliotech.api.seguranca.TokenService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/debug")
public class DebugController {
    private final TokenService tokenService;

    public DebugController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    @GetMapping("/token")
    public ResponseEntity<?> debugToken(HttpServletRequest request) {
        Map<String, Object> result = new HashMap<>();
        String header = request.getHeader("Authorization");
        String token = header != null && header.startsWith("Bearer ") ? header.substring(7) : null;
        result.put("rawAuthorization", header);
        result.put("tokenPresent", token != null);
        if (token != null) {
            try {
                result.put("isValid", tokenService.isTokenValido(token));
                result.put("user", tokenService.getUsuario(token));
            } catch (Exception e) {
                result.put("isValid", false);
                result.put("error", e.getMessage());
            }
        }
        return ResponseEntity.ok(result);
    }
}
