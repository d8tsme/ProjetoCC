package com.bibliotech.api.seguranca;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;

@Service
public class TokenService {
    private static final Key CHAVE_SECRETA = Keys.secretKeyFor(SignatureAlgorithm.HS256);


    public String gerarToken(String usuario, String cargo){
        return Jwts.builder()
                .setSubject(usuario)
                .claim("cargo", cargo)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(CHAVE_SECRETA)
                .compact();
    }

    public String getCargo(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(CHAVE_SECRETA).build().parseClaimsJws(token).getBody();
        return claims.get("cargo", String.class);
    }

    public boolean isTokenValido(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(CHAVE_SECRETA).build().parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsuario(String token) {
        Claims claims = Jwts.parserBuilder().setSigningKey(CHAVE_SECRETA).build().parseClaimsJws(token).getBody();
        return claims.getSubject();
    }
}
