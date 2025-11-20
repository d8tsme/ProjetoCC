package com.bibliotech.api.usuarios;


import jakarta.persistence.*;
import lombok.*;

@Table(name = "usuario")
@Entity(name = "usuarios")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String usuario;
    private String senha;
        private String cargo; // 'ADM' or 'USER'

    public Long getId() { return this.id; }
    public String getUsuario() { return this.usuario; }
    public void setUsuario(String usuario) { this.usuario = usuario; }
    public String getSenha() { return this.senha; }
    public void setSenha(String senha) { this.senha = senha; }
    public String getCargo() { return this.cargo; }
    public void setCargo(String cargo) { this.cargo = cargo; }
}
