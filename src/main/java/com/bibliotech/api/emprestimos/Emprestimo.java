package com.bibliotech.api.emprestimos;

import com.bibliotech.api.livros.Livro;
import com.bibliotech.api.pessoas.Pessoa;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Table(name = "emprestimo")
@Entity(name = "emprestimos")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Emprestimo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dataEmprestimo;
    private LocalDate dataDevolucao;
    private String status;

    @ManyToOne
    @JoinColumn(name = "livroId")
    private Livro livro;

    // Relacionamento ManyToOne para pessoa
    @ManyToOne
    @JoinColumn(name = "pessoaId") // A coluna da chave estrangeira na tabela 'emprestimo'
    private Pessoa pessoa;

    // Construtor para cadastro
    public Emprestimo(DadosCadastroEmprestimo dados, Livro livro, Pessoa pessoa) {
        this.livro = livro;
        this.pessoa = pessoa;
        this.status = "Em andamento";
        this.dataEmprestimo = LocalDate.now();
    }


    // Métodos de atualização e outros (adaptados para incluir o pessoa)
    public void atualizaInformacoes(DadosAlteracaoEmprestimo dados, Livro novoLivro, Pessoa novoPessoa) {
        if (dados.dataEmprestimo() != null) {
            this.dataEmprestimo = dados.dataEmprestimo();
        }
        if (novoLivro != null) {
            this.livro = novoLivro;
        }
        if (novoPessoa != null) {
            this.pessoa = novoPessoa;
        }
        this.dataDevolucao = dados.dataDevolucao();
    }

    public void atualizaDataDevolucao() {
        this.dataDevolucao = LocalDate.now();
        this.status = "Finalizado";
    }
}
