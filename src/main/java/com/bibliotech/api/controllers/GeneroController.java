package com.bibliotech.api.controllers;

import com.bibliotech.api.generos.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

//Annotations
@RestController
@RequestMapping("/generos")
public class GeneroController {
    @Autowired
    private GeneroRepositorio generoRepositorio;

    @PostMapping("/cadastrar")
    @Transactional
    public ResponseEntity<?> cadastrar(@RequestBody DadosCadastroGenero dados) {
        Genero a = generoRepositorio.save(new Genero(dados));
        Long id = a.getId();
        URI uri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/{id}").buildAndExpand(id).toUri();
        return ResponseEntity.created(uri).build();
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listar(){
        var lista = generoRepositorio.findAll().stream().map(DadosListagemGenero::new)
                .toList();
        return ResponseEntity.ok(lista);
    }

    @PutMapping("/alterar")
    @Transactional
    public ResponseEntity<?> alterar(@RequestBody DadosAlteracaoGenero dados) {
        if (!generoRepositorio.existsById(dados.id())){
            return ResponseEntity.notFound().build();
        }
        Genero a = generoRepositorio.getReferenceById(dados.id());
        a.atualizaInformacoes(dados);
        return ResponseEntity.ok(dados);
    }

    @DeleteMapping("/excluir/{id}")
    @Transactional
    public ResponseEntity<?> excluir(@PathVariable Long id) {
        if(!generoRepositorio.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        generoRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
