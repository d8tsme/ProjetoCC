package com.bibliotech.api.solicitacoes;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/solicitacoes")
public class SolicitacaoController {
    @Autowired
    private SolicitacaoRepositorio solicitacaoRepositorio;

    @PostMapping("/inserir")
    public ResponseEntity<?> inserir(@RequestBody SolicitacaoDTO dto) {
        Solicitacao s = new Solicitacao();
        s.setTipo(dto.getTipo());
        s.setNome(dto.getNome());
        s.setUsuarioId(dto.getUsuarioId());
        s.setStatus("pendente");
        s.setDataSolicitacao(LocalDateTime.now());
        solicitacaoRepositorio.save(s);
        return ResponseEntity.status(201).body(s);
    }

    @GetMapping
    public ResponseEntity<List<Solicitacao>> listar() {
        return ResponseEntity.ok(solicitacaoRepositorio.findAll());
    }

    @PutMapping("/{id}/aprovar")
    public ResponseEntity<?> aprovar(@PathVariable Long id) {
        Solicitacao s = solicitacaoRepositorio.findById(id).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        s.setStatus("aprovado");
        solicitacaoRepositorio.save(s);
        return ResponseEntity.ok(s);
    }

    @PutMapping("/{id}/rejeitar")
    public ResponseEntity<?> rejeitar(@PathVariable Long id) {
        Solicitacao s = solicitacaoRepositorio.findById(id).orElse(null);
        if (s == null) return ResponseEntity.notFound().build();
        s.setStatus("rejeitado");
        solicitacaoRepositorio.save(s);
        return ResponseEntity.ok(s);
    }
}

class SolicitacaoDTO {
    private String tipo;
    private String nome;
    private Long usuarioId;
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
}
