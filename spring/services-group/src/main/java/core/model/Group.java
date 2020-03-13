package core.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import core.model.User;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

import lombok.Data;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Property;
import org.neo4j.ogm.annotation.Relationship;

@NodeEntity
@Data
public class Group {
    @Id
    @GeneratedValue
    private Long id;

    @Property(name = "name")
    private String name;

    @Relationship(type = "TEAMLEADER")
    private User teamLeader;

    @Relationship(type = "MEMBER")
    private List<User> members = new ArrayList<>();

    @Relationship(type = "DEPUTY")
    private List<User> deputies = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Group)) return false;
        Group group = (Group) o;
        return name.equals(group.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }
}
