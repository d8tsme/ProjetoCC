package com.bibliotech.api.controllers;

import com.bibliotech.api.seguranca.AutenticacaoViaTokenFilter;
import com.bibliotech.api.seguranca.TokenService;
import com.bibliotech.api.usuarios.Usuario;
import com.bibliotech.api.usuarios.UsuarioRepositorio;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final UsuarioRepositorio usuarioRepositorio;

    public AutenticacaoController(AuthenticationManager authenticationManager, TokenService tokenService, UsuarioRepositorio usuarioRepositorio) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @PostMapping
    public ResponseEntity<?> autenticar(@RequestBody @Valid Login credenciais) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(credenciais.getUsuario(), credenciais.getSenha());
        try {
            Authentication authentication = authenticationManager.authenticate(authenticationToken);
            String usuarioNome = authentication.getName();
            Usuario usuario = usuarioRepositorio.findByUsuario(usuarioNome).orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
            String cargo = usuario.getCargo();
            String token = tokenService.gerarToken(usuarioNome, cargo);
            return ResponseEntity.ok(new Token(token, "Bearer "));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Credenciais inválidas");
        }
    }
}

@Getter
@Setter
class Login {
    private String usuario;
    private String senha;
}

@Getter
@Setter
@AllArgsConstructor
class   Token {
    private String token;
    private String tipo;
}