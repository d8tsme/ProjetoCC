package com.bibliotech.api.emprestimos;

import java.time.LocalDate;

public class DadosListagemEmprestimo {
    private Long id;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private Long livroId;
    private String livro_titulo;
    private String livro_foto;
    private Long pessoaId;
    private String pessoa_nome;
    private String status;

    public DadosListagemEmprestimo() {}

    public DadosListagemEmprestimo(Long id, LocalDate dataEmprestimo, LocalDate dataDevolucao, Long livroId, String livro_titulo, String livro_foto, Long pessoaId, String pessoa_nome, String status) {
        this.id = id;
        this.dataEmprestimo = dataEmprestimo;
        this.dataDevolucao = dataDevolucao;
        this.livroId = livroId;
        this.livro_titulo = livro_titulo;
        this.livro_foto = livro_foto;
        this.pessoaId = pessoaId;
        this.pessoa_nome = pessoa_nome;
        this.status = status;
    }

    public Long getId() { return id; }
    public LocalDate getDataEmprestimo() { return dataEmprestimo; }
    public LocalDate getDataDevolucao() { return dataDevolucao; }
    public Long getLivroId() { return livroId; }
    public String getLivro_titulo() { return livro_titulo; }
    public String getLivro_foto() { return livro_foto; }
    public Long getPessoaId() { return pessoaId; }
    public String getPessoa_nome() { return pessoa_nome; }
    public String getStatus() { return status; }
    public DadosListagemEmprestimo(Emprestimo dados) {
        this(
                dados.getId(),
                dados.getDataEmprestimo(),
                dados.getDataDevolucao(),
                dados.getLivro().getId(),
                dados.getLivro().getTitulo(),
                dados.getLivro().getFoto(),
                dados.getPessoa().getId(),
                dados.getPessoa().getNome(),
                dados.getStatus()
        );
    }

    public Long id() { return id; }
    public LocalDate dataEmprestimo() { return dataEmprestimo; }
    public LocalDate dataDevolucao() { return dataDevolucao; }
    public Long livroId() { return livroId; }
    public String livro_titulo() { return livro_titulo; }
    public String livro_foto() { return livro_foto; }
    public Long pessoaId() { return pessoaId; }
    public String pessoa_nome() { return pessoa_nome; }
    public String status() { return status; }
}
