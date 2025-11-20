package com.bibliotech.api.emprestimos;

import java.time.LocalDate;

public class DadosAlteracaoEmprestimo {
	private Long id;
	private LocalDate dataEmprestimo;
	private LocalDate dataDevolucao;
	private Long livroId;
	private Long pessoaId;

	public DadosAlteracaoEmprestimo() {}

	public DadosAlteracaoEmprestimo(Long id, LocalDate dataEmprestimo, LocalDate dataDevolucao, Long livroId, Long pessoaId) {
		this.id = id;
		this.dataEmprestimo = dataEmprestimo;
		this.dataDevolucao = dataDevolucao;
		this.livroId = livroId;
		this.pessoaId = pessoaId;
	}

	public Long getId() { return id; }
	public LocalDate getDataEmprestimo() { return dataEmprestimo; }
	public LocalDate getDataDevolucao() { return dataDevolucao; }
	public Long getLivroId() { return livroId; }
	public Long getPessoaId() { return pessoaId; }
	public Long id() { return id; }
	public LocalDate dataEmprestimo() { return dataEmprestimo; }
	public LocalDate dataDevolucao() { return dataDevolucao; }
	public Long livroId() { return livroId; }
	public Long pessoaId() { return pessoaId; }
}
