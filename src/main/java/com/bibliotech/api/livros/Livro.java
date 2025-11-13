package com.bibliotech.api.livros;

import com.bibliotech.api.autores.Autor;
import com.bibliotech.api.generos.Genero;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

@Table(name = "livro")
@Entity(name = "livros")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Livro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private String isbn;
    private int anoPublicacao;
    private int paginas;
    private String foto;
    private String status;

    @ManyToOne
    @JoinColumn(name = "autorId")
    private Autor autor;

    // Relacionamento ManyToOne para Gênero
    @ManyToOne
    @JoinColumn(name = "generoId") // A coluna da chave estrangeira na tabela 'livro'
    private Genero genero;

    // Construtor para cadastro
    public Livro(DadosCadastroLivro dados, Autor autor, Genero genero) {
        this.titulo = dados.titulo();
        this.isbn = dados.isbn();
        this.anoPublicacao = dados.anoPublicacao();
        this.autor = autor;
        this.genero = genero;
        this.foto = dados.foto();
        this.status = "Disponível";
    }


    // Métodos de atualização e outros (adaptados para incluir o gênero)
    public void atualizaInformacoes(DadosAlteracaoLivro dados, Autor novoAutor, Genero novoGenero) {
        if (dados.titulo() != null) {
            this.titulo = dados.titulo();
        }
        if (dados.isbn() != null) {
            this.isbn = dados.isbn();
        }
        if (dados.anoPublicacao() != 0) {
            this.anoPublicacao = dados.anoPublicacao();
        }
        if (novoAutor != null) {
            this.autor = novoAutor;
        }
        if (novoGenero != null) {
            this.genero = novoGenero;
        }
        if (dados.foto() != null) {
            this.foto = dados.foto();
        }
        if (dados.paginas() != 0) {
            this.paginas = dados.paginas();
        }
        if (dados.status() != null) {
            this.status = dados.status();
        }
    }

    public void atualizaStatus(String status) {
        this.status = status;
    }
}
