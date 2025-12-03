package com.bibliotech.api.controllers;

import com.bibliotech.api.pessoas.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

//Annotations
@RestController
@RequestMapping("/pessoas")
public class PessoaController {
    @Autowired
    private PessoaRepositorio pessoaRepositorio;

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroPessoa dados) {
        Pessoa a = pessoaRepositorio.save(new Pessoa(dados));
        Long id = a.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listar(){
        var lista = pessoaRepositorio.findAll().stream().map(DadosListagemPessoa::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/alterar")
    @Transactional
    public ResponseEntity<?> alterar(@RequestBody DadosAlteracaoPessoa dados) {
        if (!pessoaRepositorio.existsById(dados.id())){
            return ResponseEntity.notFound().build();
        }
        Pessoa a = pessoaRepositorio.getReferenceById(dados.id());
        a.atualizaInformacoes(dados);
        return ResponseEntity.ok(dados);
    }

    @DeleteMapping("/excluir/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if(!pessoaRepositorio.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        pessoaRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
