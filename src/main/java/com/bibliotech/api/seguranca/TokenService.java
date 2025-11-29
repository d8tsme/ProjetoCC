package com.bibliotech.api.seguranca;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Service
public class TokenService {
    private Key CHAVE_SECRETA;

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @PostConstruct
    public void init() {
        if (jwtSecret != null && !jwtSecret.isBlank()) {
            CHAVE_SECRETA = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
            System.out.println("TokenService: jwt.secret provided in configuration (dev/prod");
        } else {
            CHAVE_SECRETA = Keys.secretKeyFor(SignatureAlgorithm.HS256);
            System.out.println("TokenService: no jwt.secret set; using ephemeral secret (server restart breaks tokens)");
        }
    }

    public String gerarToken(String usuario){
        return Jwts.builder()
                .setSubject(usuario)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(CHAVE_SECRETA)
                .compact();
    }

    public boolean isTokenValido(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(CHAVE_SECRETA).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            System.out.println("Token invalid: " + e.getMessage());
            return false;
        }
    }

    public String getUsuario(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(CHAVE_SECRETA).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
