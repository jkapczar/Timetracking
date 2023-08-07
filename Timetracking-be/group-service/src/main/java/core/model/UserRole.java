package core.model;

import lombok.Data;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class UserRole {

    public UserRole(User u) {
        this.username = u.getUsername();
        this.member = u.getMemberOf() != null ? u.getMemberOf().getName() : "";
        this.teamLeader = u.getTeamLeaderIn() != null ?  u.getTeamLeaderIn().getName() : "";
        this.deputy.addAll(u.getDeputyIn().stream().map(e->e.getName()).collect(Collectors.toSet()));
    }

    private String username;
    private String member;
    private String teamLeader;
    private Set<String> deputy = new HashSet<>();
}
