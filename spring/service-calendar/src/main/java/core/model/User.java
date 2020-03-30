package core.model;

import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Objects;

@Data
@Entity(name = "User")
@Table(name = "USERS")
public class User {
    @Id
    @Column(name = "ID")
    @SequenceGenerator(name="user_sequence",sequenceName = "user_sequence",allocationSize = 1,initialValue=1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator="user_sequence"  )
    private Long id;
    @NotNull
    @Column(name = "username")
    private String username;
    @Column(name = "defaultHO")
    private Integer defaultNumOfHOs = 5;
    @Column(name = "defaultholiday")
    private Integer defaultNumOfHolidays = 21;
    @Column(name = "HO")
    private Integer numOfHOs = 0;
    @Column(name = "holiday")
    private Integer numOfHolidays = 0;


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return username.equals(user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(username);
    }
}
