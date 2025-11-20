package com.bibliotech.api.emprestimos;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class DadosCadastroEmprestimo {

        @NotNull(message = "O ID do livro é obrigatório")
        private Long livroId;

        @NotNull(message = "O ID da pessoa é obrigatório")
        private Long pessoaId;

        public DadosCadastroEmprestimo() {}

        public DadosCadastroEmprestimo(Long livroId, Long pessoaId) {
                this.livroId = livroId;
                this.pessoaId = pessoaId;
        }

        public Long getLivroId() { return livroId; }
        public Long getPessoaId() { return pessoaId; }
        public Long livroId() { return livroId; }
        public Long pessoaId() { return pessoaId; }
}
