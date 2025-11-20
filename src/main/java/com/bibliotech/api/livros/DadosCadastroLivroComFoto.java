package com.bibliotech.api.livros;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class DadosCadastroLivroComFoto {
        @NotBlank(message = "O título é obrigatório")
        private String titulo;

        private int paginas;

        @NotNull(message = "O ID do autor é obrigatório")
        private Long autorId;

        @NotNull(message = "O ID do gênero é obrigatório")
        private Long generoId;

        private String foto;

        @NotBlank(message = "O ISBN é obrigatório")
        private String isbn;

        private int anoPublicacao;

        public DadosCadastroLivroComFoto() {}

        public DadosCadastroLivroComFoto(String titulo, int paginas, Long autorId, Long generoId, String foto, String isbn, int anoPublicacao) {
                this.titulo = titulo;
                this.paginas = paginas;
                this.autorId = autorId;
                this.generoId = generoId;
                this.foto = foto;
                this.isbn = isbn;
                this.anoPublicacao = anoPublicacao;
        }

        public String getTitulo() { return titulo; }
        public int getPaginas() { return paginas; }
        public Long getAutorId() { return autorId; }
        public Long getGeneroId() { return generoId; }
        public String getFoto() { return foto; }
        public String getIsbn() { return isbn; }
        public int getAnoPublicacao() { return anoPublicacao; }
        public String titulo() { return titulo; }
        public int paginas() { return paginas; }
        public Long autorId() { return autorId; }
        public Long generoId() { return generoId; }
        public String foto() { return foto; }
        public String isbn() { return isbn; }
        public int anoPublicacao() { return anoPublicacao; }
}
