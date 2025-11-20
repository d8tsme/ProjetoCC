package com.bibliotech.api.autores;

public class DadosCadastroAutor {
	private String nome;
	private String foto;

	public DadosCadastroAutor() {}

	public DadosCadastroAutor(String nome, String foto) {
		this.nome = nome;
		this.foto = foto;
	}

	public String getNome() { return nome; }
	public String getFoto() { return foto; }
	public String nome() { return nome; }
	public String foto() { return foto; }
}
