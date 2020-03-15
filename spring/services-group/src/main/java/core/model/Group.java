package core.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import core.model.User;

import java.util.*;
import java.util.stream.Collectors;

import lombok.Data;
import org.neo4j.ogm.annotation.*;

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
    private Set<User> members = new HashSet<>();

    @Relationship(type = "DEPUTY")
    private Set<User> deputies = new HashSet<>();

    public void addMember(User user) {
        user.setMemberOf(this);
        this.members.add(user);
    }

    public void removeMember(User user) {
        this.members.remove(user);
        user.setMemberOf(null);
    }

    public void addDeputy(User user) {
        user.getDeputyIn().add(this);
        this.deputies.add(user);
    }

    public void removeDeputy(User user) {
        this.deputies.remove(user);
        user.getDeputyIn().remove(this);
    }

    public void addTeamLeader(User user) {
        user.setTeamLeaderIn(this);
        this.teamLeader = user;
    }

    public void removeTeamLeader(User user) {
        this.teamLeader = null;
        user.setTeamLeaderIn(null);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Group)) return false;
        Group group = (Group) o;
        return id.equals(group.id) &&
                name.equals(group.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
