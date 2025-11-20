package com.bibliotech.api.usuarios;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.bibliotech.api.seguranca.TokenService;
import com.bibliotech.api.pessoas.Pessoa;
import com.bibliotech.api.pessoas.PessoaRepositorio;
import org.springframework.web.bind.annotation.*;
import jakarta.transaction.Transactional;

import java.util.Optional;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioRepositorio usuarioRepositorio;
    @Autowired
    private PessoaRepositorio pessoaRepositorio;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody CadastroDTO dados) {
        if (usuarioRepositorio.findByUsuario(dados.getUsuario()).isPresent()) {
            return ResponseEntity.status(409).body("Usuário já cadastrado");
        }

        Pessoa p = new Pessoa();
        p.setNome(dados.getNome());
        p.setEmail(dados.getEmail());
        p.setTelefone(dados.getTelefone());
        pessoaRepositorio.save(p);

        Usuario usuario = new Usuario();
        usuario.setUsuario(dados.getUsuario());
        usuario.setSenha(passwordEncoder.encode(dados.getSenha()));
        usuario.setCargo("USER");
        usuarioRepositorio.save(usuario);

        String token = tokenService.gerarToken(usuario.getUsuario(), usuario.getCargo());
        return ResponseEntity.status(201).body(new LoginResponse(token, usuario.getCargo()));
    }

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody UsuarioDTO dados) {
        if (usuarioRepositorio.findByUsuario(dados.getUsuario()).isPresent()) {
            return ResponseEntity.status(409).body("Usuário já cadastrado");
        }
        Usuario usuario = new Usuario();
        usuario.setUsuario(dados.getUsuario());
        usuario.setSenha(passwordEncoder.encode(dados.getSenha()));
        usuario.setCargo(dados.getCargo() != null ? dados.getCargo() : "USER");
        usuarioRepositorio.save(usuario);
        String token = tokenService.gerarToken(usuario.getUsuario(), usuario.getCargo());
        return ResponseEntity.status(201).body(new LoginResponse(token, usuario.getCargo()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioDTO dados) {
        Optional<Usuario> opt = usuarioRepositorio.findByUsuario(dados.getUsuario());
        if (opt.isEmpty()) {
            return ResponseEntity.status(401).body("Usuário não encontrado");
        }
        Usuario usuario = opt.get();
        if (!passwordEncoder.matches(dados.getSenha(), usuario.getSenha())) {
            return ResponseEntity.status(401).body("Senha incorreta");
        }
        String token = tokenService.gerarToken(usuario.getUsuario(), usuario.getCargo());
        return ResponseEntity.ok(new LoginResponse(token, usuario.getCargo()));
    }
}


class UsuarioDTO {
    private String usuario;
    private String senha;
    private String cargo;
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getCargo() { return cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
}


class LoginResponse {
    private String token;
    private String cargo;
    public LoginResponse(String token, String cargo) {
        this.token = token;
        this.cargo = cargo;
    }
    public String getToken() { return token; }
    public String getCargo() { return cargo; }
}

class CadastroDTO {
    private String nome;
    private String email;
    private int telefone;
    private String usuario;
    private String senha;

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public int getTelefone() { return telefone; }
    public void setTelefone(int telefone) { this.telefone = telefone; }
    public String getUsuario() { return usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getSenha() { return senha; }
    public void setSenha(String senha) { this.senha = senha; }
}
