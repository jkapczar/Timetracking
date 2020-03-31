package core.dao;

import core.model.Group;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.CrudRepository;


import java.util.Set;

public interface GroupDao extends CrudRepository<Group, Long> {
    @Query("MATCH (n:Group) return n.name")
    Set<String> getGroupNames();

    @Query("MATCH (n:Group {name: $name}) optional match (n)-[r]->(u:User) return *")
    Group findGroupByName(String name);

    @Query("match(n:User {username: $username})<-[:DEPUTY |:TEAMLEADER]-(g:Group) return (g)-[]->()")
    Group findGroupMembersByTeamLeader(String username);

    @Query("match(n:User {username: $username}) where (n)<-[:TEAMLEADER|:DEPUTY]-(:Group) return n")
    Group privilegeCheck(String username);

}
