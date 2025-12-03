package com.bibliotech.api.livros;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public record DadosCadastroLivro(
        @NotBlank(message = "O título é obrigatório")
        String titulo,

        int paginas,

        @NotNull(message = "O ID do autor é obrigatório")
        Long autorId,

        @NotNull(message = "O ID do gênero é obrigatório")
        Long generoId,

        String foto,

        @NotBlank(message = "O ISBN é obrigatório")
        String isbn,

        int anoPublicacao
) {}
