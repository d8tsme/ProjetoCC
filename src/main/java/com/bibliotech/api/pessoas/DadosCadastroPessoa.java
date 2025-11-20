package com.bibliotech.api.pessoas;

public class DadosCadastroPessoa {
	private String nome;
	private String email;
	private int telefone;

	public DadosCadastroPessoa() {}

	public DadosCadastroPessoa(String nome, String email, int telefone) {
		this.nome = nome;
		this.email = email;
		this.telefone = telefone;
	}

	public String getNome() { return nome; }
	public String getEmail() { return email; }
	public int getTelefone() { return telefone; }
	public String nome() { return nome; }
	public String email() { return email; }
	public int telefone() { return telefone; }
}
