package com.bibliotech.api.generos;

public class DadosListagemGenero {
    private Long id;
    private String nome;

    public DadosListagemGenero() {}

    public DadosListagemGenero(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }

    public DadosListagemGenero(Genero dados) {
        this(dados.getId(), dados.getNome());
    }
}
