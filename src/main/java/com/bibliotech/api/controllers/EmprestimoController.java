package com.bibliotech.api.controllers;

import com.bibliotech.api.autores.DadosListagemAutor;
import com.bibliotech.api.livros.Livro;
import com.bibliotech.api.emprestimos.*;
import com.bibliotech.api.livros.LivroRepositorio;
import com.bibliotech.api.pessoas.Pessoa;
import com.bibliotech.api.pessoas.PessoaRepositorio;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {

    @Autowired
    private EmprestimoRepositorio emprestimoRepositorio;
    @Autowired
    private LivroRepositorio livroRepositorio;
    @Autowired
    private PessoaRepositorio pessoaRepositorio;

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody @Valid DadosCadastroEmprestimo dados) {
        try {
            Livro livro = livroRepositorio.getReferenceById(dados.livroId());

            if (livro.getStatus().equals("Reservado")) {
                return ResponseEntity.badRequest().body("Livro está reservado — não pode ser emprestado.");
            }
            if (livro.getStatus().equals("Emprestado")) {
                return ResponseEntity.badRequest().body("Livro já emprestado.");
            }

            Pessoa pessoa = pessoaRepositorio.getReferenceById(dados.pessoaId());
            Emprestimo emprestimo = new Emprestimo(dados, livro, pessoa);

            emprestimoRepositorio.save(emprestimo);
            livro.atualizaStatus("Emprestado");

            return ResponseEntity.ok().build();

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar empréstimo: " + e.getMessage());
        }
    }
}

