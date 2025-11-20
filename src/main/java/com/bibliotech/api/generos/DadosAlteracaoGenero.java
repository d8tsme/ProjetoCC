package com.bibliotech.api.generos;

public class DadosAlteracaoGenero {
	private Long id;
	private String nome;

	public DadosAlteracaoGenero() {}

	public DadosAlteracaoGenero(Long id, String nome) {
		this.id = id;
		this.nome = nome;
	}

	public Long getId() { return id; }
	public String getNome() { return nome; }
	public Long id() { return id; }
	public String nome() { return nome; }
}
