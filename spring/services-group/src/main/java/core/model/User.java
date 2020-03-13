package core.model;

import core.model.Group;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import lombok.Data;
import org.neo4j.ogm.annotation.*;

@NodeEntity
@Data
public class User {
    @Id
    @GeneratedValue
    private Long id;

    @Property(name = "username")
    private String username;

    @Relationship(type = "MEMBER", direction = Relationship.INCOMING)
    private Group memberOf;

    @Relationship(type = "TEAMLEADER", direction = Relationship.INCOMING)
    private Group teamLeaderIn;

    @Relationship(type = "DEPUTY", direction = Relationship.INCOMING)
    private List<Group> deputyIn = new ArrayList<>();

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