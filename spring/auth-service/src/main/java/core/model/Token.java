package core.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity(name = "Token")
@Table(name = "TOKENS")
public class Token {
    @Id
    @NotNull
    @Column(name = "ID")
    @SequenceGenerator(name="token_sequence",sequenceName = "token_sequence",allocationSize = 1, initialValue = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="token_sequence"  )
    private Long id;
    @Column(name = "token")
    private String token;
    @Column(name = "username")
    private String username;
    @Lob
    @Column(name = "details", length = 4096)
    private String userDetails;
}
