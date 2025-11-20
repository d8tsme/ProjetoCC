package com.bibliotech.api.reservas;

import java.time.LocalDate;

public class DadosAlteracaoReserva {
	private Long id;
	private LocalDate dataReserva;
	private Long livroId;
	private Long pessoaId;

	public DadosAlteracaoReserva() {}

	public DadosAlteracaoReserva(Long id, LocalDate dataReserva, Long livroId, Long pessoaId) {
		this.id = id;
		this.dataReserva = dataReserva;
		this.livroId = livroId;
		this.pessoaId = pessoaId;
	}

	public Long getId() { return id; }
	public LocalDate getDataReserva() { return dataReserva; }
	public Long getLivroId() { return livroId; }
	public Long getPessoaId() { return pessoaId; }
	public Long id() { return id; }
	public LocalDate dataReserva() { return dataReserva; }
	public Long livroId() { return livroId; }
	public Long pessoaId() { return pessoaId; }
}
