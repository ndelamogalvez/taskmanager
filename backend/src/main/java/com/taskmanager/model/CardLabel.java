package com.taskmanager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "card_labels")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CardLabel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String color;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "card_id", nullable = false)
    private Card card;
}
