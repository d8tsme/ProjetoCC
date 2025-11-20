package com.bibliotech.api.autores;

public class DadosAlteracaoAutor {
	private Long id;
	private String nome;
	private String foto;

	public DadosAlteracaoAutor() {}

	public DadosAlteracaoAutor(Long id, String nome, String foto) {
		this.id = id;
		this.nome = nome;
		this.foto = foto;
	}

	public Long getId() { return id; }
	public String getNome() { return nome; }
	public String getFoto() { return foto; }
	public Long id() { return id; }
	public String nome() { return nome; }
	public String foto() { return foto; }
}
