package com.bibliotech.api.solicitacoes;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Table(name = "solicitacao")
@Entity(name = "solicitacoes")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class Solicitacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String tipo; // 'autor' ou 'gênero'
    private String nome;
    private Long usuarioId;
    private String status; // 'pendente', 'aprovado', 'rejeitado'
    private LocalDateTime dataSolicitacao;
}
