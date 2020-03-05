package auth.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;


@Data
@Entity(name = "User")
@Table(name = "USERCREDS")
@NamedQueries({
        @NamedQuery(name = "User.findById", query = "Select u from User u where  u.id = :id"),
        @NamedQuery(name = "User.findUsername", query = "Select u from User u where u.username = :username"),
        @NamedQuery(name = "User.updateStatus", query = "Update User u set u.active = CASE u.active " +
                "WHEN TRUE THEN FALSE ELSE TRUE END where u.username = :username")
})
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    @Id
    @NotNull
    @Column(name = "ID")
    @SequenceGenerator(name="usercred_sequence",sequenceName = "usercred_sequence",allocationSize = 1,initialValue=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="usercred_sequence"  )
    private Long id;
    @NotNull
    @Column(name = "username")
    private String username;
    @NotNull
    @Column(name = "password")
    private String password;
    @NotNull
    @Column(name = "secquestion")
    private String secQuestion;
    @NotNull
    @Column(name = "secanswer")
    private String secAnswer;
    @NotNull
    @Column(name = "active")
    private boolean active = false;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdOn;
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedOn;

    public User() {}

    public User(String username, String password, String secQuestion, String secAnswer) {
        this.username = username;
        this.password = password;
        this.secQuestion = secQuestion;
        this.secAnswer = secAnswer;
    }

}
