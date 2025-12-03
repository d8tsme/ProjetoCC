package com.bibliotech.api.controllers;

import com.bibliotech.api.emprestimos.DadosAlteracaoEmprestimo;
import com.bibliotech.api.emprestimos.DadosCadastroEmprestimo;
import com.bibliotech.api.emprestimos.Emprestimo;
import com.bibliotech.api.emprestimos.EmprestimoRepositorio;
import com.bibliotech.api.reservas.DadosCadastroReserva;
import com.bibliotech.api.reservas.Reserva;
import com.bibliotech.api.livros.Livro;
import com.bibliotech.api.reservas.*;
import com.bibliotech.api.livros.LivroRepositorio;
import com.bibliotech.api.pessoas.Pessoa;
import com.bibliotech.api.pessoas.PessoaRepositorio;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Optional;

@RestController
@RequestMapping("/reservas")
public class ReservaController {

    @Autowired
    private ReservaRepositorio reservaRepositorio;
    @Autowired
    private LivroRepositorio livroRepositorio;
    @Autowired
    private PessoaRepositorio pessoaRepositorio;
    @Autowired
    private EmprestimoRepositorio emprestimoRepositorio;


    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody @Valid DadosCadastroReserva dados) {
        try {
            Livro livro = livroRepositorio.getReferenceById(dados.livroId());

            if (!livro.getStatus().equals("Disponível")) {
                return ResponseEntity.badRequest().body("Livro não está disponível para reserva.");
            }

            Pessoa pessoa = pessoaRepositorio.getReferenceById(dados.pessoaId());
            Reserva reserva = new Reserva(dados, livro, pessoa);
            reservaRepositorio.save(reserva);

            livro.atualizaStatus("Reservado");

            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao cadastrar reserva: " + e.getMessage());
        }
    }


    @GetMapping("/listar")
    public ResponseEntity<?> listar() {
        try {
            var reservas = reservaRepositorio.findAll();
            var dados = reservas.stream().map(DadosListagemReserva::new).toList();
            return ResponseEntity.ok(dados);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erro ao listar reservas: " + e.getMessage());
        }
    }


    @PutMapping("/atualizar/{id}")
    @Transactional
    public ResponseEntity atualizar(@PathVariable Long id,
                                    @RequestBody @Valid DadosAlteracaoReserva dados) {
        Reserva reserva = reservaRepositorio.getReferenceById(id);

        Optional<Livro> novoLivro = Optional.empty();
        if (dados.livroId() != null) novoLivro = livroRepositorio.findById(dados.livroId());

        Optional<Pessoa> novoPessoa = Optional.empty();
        if (dados.pessoaId() != null) novoPessoa = pessoaRepositorio.findById(dados.pessoaId());

        reserva.atualizaInformacoes(dados, novoLivro.orElse(null), novoPessoa.orElse(null));

        return ResponseEntity.ok(new DadosListagemReserva(reserva));
    }


    @PutMapping("/confirmar-posse/{id}")
    @Transactional
    public ResponseEntity<?> confirmarPosse(@PathVariable Long id) {

        Reserva reserva = reservaRepositorio.getReferenceById(id);

        // verificação de validade
        if (reserva.getDataValidade().isBefore(LocalDate.now())) {
            return ResponseEntity.badRequest().body("Reserva vencida — não é possível confirmar posse.");
        }

        Livro livro = reserva.getLivro();
        Pessoa pessoa = reserva.getPessoa();

        if (!livro.getStatus().equals("Reservado")) {
            return ResponseEntity.badRequest().body("Livro não está reservado.");
        }

        // Criação automática do empréstimo
        Emprestimo emprestimo = new Emprestimo(
                new DadosCadastroEmprestimo(livro.getId(), pessoa.getId()),
                livro,
                pessoa
        );
        emprestimoRepositorio.save(emprestimo);

        // atualizar status de livro
        livro.atualizaStatus("Emprestado");

        // finalizar a reserva
        reserva.setStatus("Finalizada");

        return ResponseEntity.ok("Posse confirmada e empréstimo registrado.");
    }


    @DeleteMapping("excluir/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {

        Reserva reserva = reservaRepositorio.getReferenceById(id);
        Livro livro = reserva.getLivro();

        // se o livro estiver reservado por esta reserva, libera ele
        if (livro.getStatus().equals("Reservado")) {
            livro.atualizaStatus("Disponível");
        }

        reservaRepositorio.delete(reserva);

        return ResponseEntity.ok("Reserva excluída.");
    }


    @PostMapping("/atualizar-vencidas")
    @Transactional
    public ResponseEntity<?> atualizarVencidas() {

        var reservas = reservaRepositorio.findAll();

        reservas.forEach(r -> {
            if (r.getDataValidade().isBefore(LocalDate.now()) &&
                    r.getStatus().equals("Em andamento")) {

                r.setStatus("Vencida");
                r.getLivro().atualizaStatus("Disponível");
            }
        });

        return ResponseEntity.ok("Reservas vencidas atualizadas.");
    }

    @PutMapping("/{id}/confirmar-posse")
    @Transactional
    public ResponseEntity<?> confirmarPosseUpdate(@PathVariable Long id) {
        Reserva reserva = reservaRepositorio.getReferenceById(id);
        reserva.setConfirmarPosse(true);
        return ResponseEntity.ok(new DadosListagemReserva(reserva));
    }
}
