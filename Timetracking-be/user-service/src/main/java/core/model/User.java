package core.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;


@Data
@Entity(name = "User")
@Table(name = "USERS", uniqueConstraints={
        @UniqueConstraint(columnNames="username",name = "usernameConstraint")
})
@JsonIgnoreProperties(ignoreUnknown = true)
public class User {
    @Id
    @NotNull
    @Column(name = "ID")
    @SequenceGenerator(name="user_sequence",sequenceName = "user_sequence",allocationSize = 1,initialValue=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="user_sequence"  )
    private Long id;
    @NotNull
    @Column(name = "username")
    private String username;
    @NotNull
    @Column(name = "firstname")
    private String firstName;
    @NotNull
    @Column(name = "lastname")
    private String lastName;
    @NotNull
    @Email
    @Column(name = "email")
    private String email;
    @NotNull
    @Column(name = "phone")
    private String phone;
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdOn;
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedOn;

    public User() {}

    public User(String username, String firstName, String lastName, String email) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
    }

}
