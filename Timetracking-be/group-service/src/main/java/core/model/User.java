package core.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import core.model.Group;

import java.util.*;
import java.util.stream.Collectors;

import lombok.Data;
import org.neo4j.ogm.annotation.*;
import org.springframework.data.neo4j.annotation.QueryResult;

@NodeEntity
@Data
public class User {
    @Id
    @GeneratedValue
    @JsonIgnore
    private Long id;

    @Property(name = "username")
    private String username;

    @JsonIgnore
    @Relationship(type = "MEMBER", direction = Relationship.INCOMING)
    private Group memberOf;

    @JsonIgnore
    @Relationship(type = "TEAMLEADER", direction = Relationship.INCOMING)
    private Group teamLeaderIn;

    @JsonIgnore
    @Relationship(type = "DEPUTY", direction = Relationship.INCOMING)
    private Set<Group> deputyIn = new HashSet<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof User)) return false;
        User user = (User) o;
        return id.equals(user.id) &&
                username.equals(user.username);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, username);
    }
}