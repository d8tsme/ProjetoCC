package com.bibliotech.api.controllers;

import com.bibliotech.api.autores.Autor;
import com.bibliotech.api.livros.*;
import com.bibliotech.api.autores.AutorRepositorio;
import com.bibliotech.api.generos.Genero;
import com.bibliotech.api.generos.GeneroRepositorio;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/livros")
public class LivroController {
    @Autowired
    private LivroRepositorio livroRepositorio;
    @Autowired
    private AutorRepositorio autorRepositorio;
    @Autowired
    private GeneroRepositorio generoRepositorio;

    @PostMapping
    @Transactional
    public ResponseEntity cadastrar(@RequestBody @Valid DadosCadastroLivro dados) {
        Autor autor = autorRepositorio.getReferenceById(dados.autorId());
        Genero genero = generoRepositorio.getReferenceById(dados.generoId());
        Livro livro = new Livro(dados, autor, genero);
        livroRepositorio.save(livro);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/inserir")
    @Transactional
    public ResponseEntity cadastrarComFoto(@ModelAttribute @Valid DadosCadastroLivroComFoto dados) {
        Autor autor = autorRepositorio.getReferenceById(dados.autorId());
        Genero genero = generoRepositorio.getReferenceById(dados.generoId());

        String fotoPath = null;
        if (dados.foto() != null && !dados.foto().isEmpty()) {
            try {
                String fileName = UUID.randomUUID().toString() + "_" + dados.foto().getOriginalFilename();
                Path uploadPath = Paths.get("uploads/livros");
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(fileName);
                Files.write(filePath, dados.foto().getBytes());
                fotoPath = filePath.toString();
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Erro ao salvar a foto");
            }
        }

        DadosCadastroLivro dadosLivro = new DadosCadastroLivro(
            dados.titulo(),
            dados.paginas(),
            dados.autorId(),
            dados.generoId(),
            fotoPath,
            dados.isbn(),
            dados.anoPublicacao()
        );

        Livro livro = new Livro(dadosLivro, autor, genero);
        livroRepositorio.save(livro);
        return ResponseEntity.ok(new DadosListagemLivro(livro));
    }

    @GetMapping("/listar")
    public ResponseEntity<?> listar(@RequestParam(required = false) String status) {
        List<DadosListagemLivro> livros = null;
        if (status != null) {
            livros = livroRepositorio.findByStatus(status).stream().map(DadosListagemLivro::new).toList();
            return ResponseEntity.ok(livros);
        } else {
            livros = livroRepositorio.findAll().stream().map(DadosListagemLivro::new).toList();
            return ResponseEntity.ok(livros);
        }
    }

    @PutMapping("/atualizar/{id}")
    @Transactional
    public ResponseEntity atualizar(@PathVariable Long id, @RequestBody @Valid DadosAlteracaoLivro dados) {
        Livro livro = livroRepositorio.getReferenceById(id);

        Optional<Autor> novoAutor = Optional.empty();
        if (dados.autorId() != null) {
            novoAutor = autorRepositorio.findById(dados.autorId());
        }

        Optional<Genero> novoGenero = Optional.empty();
        if (dados.generoId() != null) {
            novoGenero = generoRepositorio.findById(dados.generoId());
        }

        livro.atualizaInformacoes(dados, novoAutor.orElse(null), novoGenero.orElse(null));
        return ResponseEntity.ok(new DadosListagemLivro(livro));
    }

    @GetMapping("/autor/{id}")
    public ResponseEntity<?> listarPeloId(@PathVariable Long id) {
        if(!autorRepositorio.existsById(id)){
            return ResponseEntity.notFound().build();
        }
        List<Livro> livros = livroRepositorio.findByAutorId(id);
        return ResponseEntity.ok(livros);
    }

}
