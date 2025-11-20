package com.bibliotech.api.reservas;

import com.bibliotech.api.reservas.Reserva;

import java.time.LocalDate;

public class DadosListagemReserva {
    private Long id;
    private LocalDate dataReserva;
    private LocalDate dataValidade;
    private Long livroId;
    private String livro_titulo;
    private String livro_foto;
    private Long pessoaId;
    private String pessoa_nome;

    public DadosListagemReserva(Long id, LocalDate dataReserva, LocalDate dataValidade, Long livroId, String livro_titulo, String livro_foto, Long pessoaId, String pessoa_nome) {
        this.id = id;
        this.dataReserva = dataReserva;
        this.dataValidade = dataValidade;
        this.livroId = livroId;
        this.livro_titulo = livro_titulo;
        this.livro_foto = livro_foto;
        this.pessoaId = pessoaId;
        this.pessoa_nome = pessoa_nome;
    }

    public DadosListagemReserva(Reserva dados) {
        this(
                dados.getId(),
                dados.getDataReserva(),
                dados.getDataValidade(),
                dados.getLivro().getId(),
                dados.getLivro().getTitulo(),
                dados.getLivro().getFoto(),
                dados.getPessoa().getId(),
                dados.getPessoa().getNome()
        );
    }

    public Long getId() { return id; }
    public LocalDate getDataReserva() { return dataReserva; }
    public LocalDate getDataValidade() { return dataValidade; }
    public Long getLivroId() { return livroId; }
    public String getLivro_titulo() { return livro_titulo; }
    public String getLivro_foto() { return livro_foto; }
    public Long getPessoaId() { return pessoaId; }
    public String getPessoa_nome() { return pessoa_nome; }
    public Long id() { return id; }
    public LocalDate dataReserva() { return dataReserva; }
    public LocalDate dataValidade() { return dataValidade; }
    public Long livroId() { return livroId; }
    public String livro_titulo() { return livro_titulo; }
    public String livro_foto() { return livro_foto; }
    public Long pessoaId() { return pessoaId; }
    public String pessoa_nome() { return pessoa_nome; }
}