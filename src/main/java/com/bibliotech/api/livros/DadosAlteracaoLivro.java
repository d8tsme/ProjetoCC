package com.bibliotech.api.livros;

public class DadosAlteracaoLivro {
	private Long id;
	private String titulo;
	private String isbn;
	private String foto;
	private int anoPublicacao;
	private Long autorId;
	private Long generoId;
	private int paginas;
	private String status;

	public DadosAlteracaoLivro() {}

	public DadosAlteracaoLivro(Long id, String titulo, String isbn, String foto, int anoPublicacao, Long autorId, Long generoId, int paginas, String status) {
		this.id = id;
		this.titulo = titulo;
		this.isbn = isbn;
		this.foto = foto;
		this.anoPublicacao = anoPublicacao;
		this.autorId = autorId;
		this.generoId = generoId;
		this.paginas = paginas;
		this.status = status;
	}

	public Long getId() { return id; }
	public String getTitulo() { return titulo; }
	public String getIsbn() { return isbn; }
	public String getFoto() { return foto; }
	public int getAnoPublicacao() { return anoPublicacao; }
	public Long getAutorId() { return autorId; }
	public Long getGeneroId() { return generoId; }
	public int getPaginas() { return paginas; }
	public String getStatus() { return status; }
	public Long id() { return id; }
	public String titulo() { return titulo; }
	public String isbn() { return isbn; }
	public String foto() { return foto; }
	public int anoPublicacao() { return anoPublicacao; }
	public Long authorId() { return autorId; }
	public Long autorId() { return autorId; }
	public Long generoId() { return generoId; }
	public int paginas() { return paginas; }
	public String status() { return status; }
}
