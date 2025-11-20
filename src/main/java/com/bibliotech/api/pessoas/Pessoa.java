package com.bibliotech.api.pessoas;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

@Table(name = "pessoa")
@Entity(name = "pessoas")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Pessoa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String email;
    private int telefone;

    public Pessoa(DadosCadastroPessoa dados) {
        this.nome = dados.nome();
        this.email = dados.email();
        this.telefone = dados.telefone();
    }
    public void atualizaInformacoes(DadosAlteracaoPessoa dados){
        if (dados.nome() != null) {
            this.nome = dados.nome();
        }
        if (dados.email() != null) {
            this.email = dados.email();
        }
        if (dados.telefone() != 0) {
            this.telefone = dados.telefone();
        }
    }

    public Long getId() { return this.id; }
    public String getNome() { return this.nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getEmail() { return this.email; }
    public void setEmail(String email) { this.email = email; }
    public int getTelefone() { return this.telefone; }
    public void setTelefone(int telefone) { this.telefone = telefone; }
}
