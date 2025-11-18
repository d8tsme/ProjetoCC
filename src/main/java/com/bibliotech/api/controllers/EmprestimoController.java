package com.bibliotech.api.controllers;

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

    @PostMapping("/inserir")
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody @Valid DadosCadastroEmprestimo dados) {
        try {
            Livro livro = livroRepositorio.getReferenceById(dados.livroId());
            Pessoa pessoa = pessoaRepositorio.getReferenceById(dados.pessoaId());
            Emprestimo emprestimo = new Emprestimo(dados, livro, pessoa);
            emprestimoRepositorio.save(emprestimo);

            livro.atualizaStatus("Emprestado");

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar empréstimo: " + e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<Page<DadosListagemEmprestimo>> listar(Pageable paginacao) {
        Page<DadosListagemEmprestimo> page = emprestimoRepositorio.findAll(paginacao).map(DadosListagemEmprestimo::new);
        return ResponseEntity.ok(page);
    }

    @PutMapping("/{id}")
    @Transactional
    public ResponseEntity atualizar(@PathVariable Long id, @RequestBody @Valid DadosAlteracaoEmprestimo dados) {
        if (!emprestimoRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Emprestimo emprestimo = emprestimoRepositorio.getReferenceById(id);
        Livro livro = livroRepositorio.getReferenceById(dados.livroId());
        Pessoa pessoa = pessoaRepositorio.getReferenceById(dados.pessoaId());
        emprestimo.atualizaInformacoes(dados, livro, pessoa);
        return ResponseEntity.ok(new DadosListagemEmprestimo(emprestimo));
    }

    @PutMapping("/devolucao/{id}")
    @Transactional
    // atualizaDataDevolucao (emprestimo)
    // livro -> atualizaStatus ("Disponivel")
    public ResponseEntity devolver(@PathVariable Long id, @RequestBody @Valid DadosAlteracaoEmprestimo dados) {
        if (!emprestimoRepositorio.existsById(dados.id())) {
            return ResponseEntity.notFound().build();
        }
        Emprestimo emprestimo = emprestimoRepositorio.getReferenceById(id);
        Livro livro = livroRepositorio.getReferenceById(dados.livroId());
        livro.atualizaStatus("Disponível");
        emprestimo.atualizaDataDevolucao();
        return ResponseEntity.ok().build();
    }
}
