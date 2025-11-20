package com.bibliotech.api.livros;

import com.bibliotech.api.autores.Autor;

public class DadosListagemLivro {
    private Long id;
    private String titulo;
    private String foto;
    private String isbn;
    private int anoPublicacao;
    private Long generoId;
    private String generoNome;
    private Long autorId;
    private String autorNome;
    private String status;
    private int paginas;

    public DadosListagemLivro() {}

    public DadosListagemLivro(Livro livro) {
        this(livro.getId(), livro.getTitulo(), livro.getFoto(), livro.getIsbn(), livro.getAnoPublicacao(), livro.getGenero().getId(), livro.getGenero().getNome(), livro.getAutor().getId(), livro.getAutor().getNome(), livro.getStatus(), livro.getPaginas());
    }

    public DadosListagemLivro(Long id, String titulo, String foto, String isbn, int anoPublicacao, Long generoId, String generoNome, Long autorId, String autorNome, String status, int paginas) {
        this.id = id;
        this.titulo = titulo;
        this.foto = foto;
        this.isbn = isbn;
        this.anoPublicacao = anoPublicacao;
        this.generoId = generoId;
        this.generoNome = generoNome;
        this.autorId = autorId;
        this.autorNome = autorNome;
        this.status = status;
        this.paginas = paginas;
    }

    public Long getId() { return id; }
    public String getTitulo() { return titulo; }
    public String getFoto() { return foto; }
    public String getIsbn() { return isbn; }
    public int getAnoPublicacao() { return anoPublicacao; }
    public Long getGeneroId() { return generoId; }
    public String getGeneroNome() { return generoNome; }
    public Long getAutorId() { return autorId; }
    public String getAutorNome() { return autorNome; }
    public String getStatus() { return status; }
    public int getPaginas() { return paginas; }
    public Long id() { return id; }
    public String titulo() { return titulo; }
    public String foto() { return foto; }
    public String isbn() { return isbn; }
    public int anoPublicacao() { return anoPublicacao; }
    public Long generoId() { return generoId; }
    public String generoNome() { return generoNome; }
    public Long autorId() { return autorId; }
    public String autorNome() { return autorNome; }
    public String status() { return status; }
    public int paginas() { return paginas; }
}
