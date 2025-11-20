package com.bibliotech.api.pessoas;

public class DadosListagemPessoa {
    private Long id;
    private String nome;
    private String email;
    private int telefone;

    public DadosListagemPessoa() {}

    public DadosListagemPessoa(Long id, String nome, String email, int telefone) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public int getTelefone() { return telefone; }
    public Long id() { return id; }
    public String nome() { return nome; }
    public String email() { return email; }
    public int telefone() { return telefone; }
}
