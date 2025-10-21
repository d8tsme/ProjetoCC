package com.bibliotech.api.reservas;

import com.bibliotech.api.livros.Livro;
import com.bibliotech.api.pessoas.Pessoa;
import jakarta.persistence.*;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;

@Table(name = "reserva")
@Entity(name = "reservas")
@Getter
@Setter
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate dataReserva;
    private LocalDate dataValidade;

    @ManyToOne
    @JoinColumn(name = "livroId")
    private Livro livro;

    // Relacionamento ManyToOne para pessoa
    @ManyToOne
    @JoinColumn(name = "pessoaId") // A coluna da chave estrangeira na tabela 'reserva'
    private Pessoa pessoa;

    // Construtor para cadastro
    public Reserva(DadosCadastroReserva dados, Livro livro, Pessoa pessoa) {
        this.dataReserva = dados.dataReserva();
        this.dataValidade = dados.dataReserva().plusDays(15);
        this.livro = livro;
        this.pessoa = pessoa;
    }


    // Métodos de atualização e outros (adaptados para incluir o pessoa)
    public void atualizaInformacoes(DadosAlteracaoReserva dados, Livro novoLivro, Pessoa novoPessoa) {
        if (dados.dataReserva() != null) {
            this.dataReserva = dados.dataReserva();
        }
        if (novoLivro != null) {
            this.livro = novoLivro;
        }
        if (novoPessoa != null) {
            this.pessoa = novoPessoa;
        }
        this.dataValidade = dados.dataReserva().plusDays(15);
    }

}