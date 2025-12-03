package com.bibliotech.api.reservas;

import com.bibliotech.api.reservas.Reserva;

import java.time.LocalDate;

public record DadosListagemReserva(Long id, LocalDate dataReserva, LocalDate dataValidade, Long livroId, String livro_titulo, String livro_foto, Long pessoaId, String pessoa_nome, Boolean confirmarPosse) {
    public DadosListagemReserva(Reserva dados) {
        this(
                dados.getId(),
                dados.getDataReserva(),              // LocalDate
                dados.getDataValidade(),               // LocalDate
                dados.getLivro().getId(),               // Long livroId
                dados.getLivro().getTitulo(),           // String livro_titulo
                dados.getLivro().getFoto(),             // String livro_foto
                dados.getPessoa().getId(),              // Long pessoaId
                dados.getPessoa().getNome(),            // String pessoa_nome
                dados.getConfirmarPosse()               // Boolean confirmarPosse
        );
    }
}