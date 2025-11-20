package com.bibliotech.api.reservas;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public class DadosCadastroReserva {

        @NotNull(message = "O ID do livro é obrigatório")
        private Long livroId;

        @NotNull(message = "O ID da pessoa é obrigatório")
        private Long pessoaId;

        @NotNull(message = "A data da reserva é obrigatória")
        private LocalDate dataReserva;

        public DadosCadastroReserva() {}

        public DadosCadastroReserva(Long livroId, Long pessoaId, LocalDate dataReserva) {
                this.livroId = livroId;
                this.pessoaId = pessoaId;
                this.dataReserva = dataReserva;
        }

        public Long getLivroId() { return livroId; }
        public Long getPessoaId() { return pessoaId; }
        public LocalDate getDataReserva() { return dataReserva; }
        public Long livroId() { return livroId; }
        public Long pessoaId() { return pessoaId; }
        public LocalDate dataReserva() { return dataReserva; }
}
