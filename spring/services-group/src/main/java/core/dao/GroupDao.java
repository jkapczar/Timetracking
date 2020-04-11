package core.dao;

import core.model.Group;
import core.model.GroupAndUser;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.CrudRepository;


import java.util.Set;

public interface GroupDao extends CrudRepository<Group, Long> {
    @Query("MATCH (n:Group) return n.name")
    Set<String> getGroupNames();

    @Query("MATCH (n:Group {name: $name}) optional match (n)-[r]->(u:User) return *")
    Group findGroupByName(String name);

    @Query("MATCH (n:Group)-[]-(u:User) return distinct  n.name as groupName, collect(u.username) as users")
    Set<GroupAndUser> findAllGroupsAndUsers();

    // TODO remove
    @Query("match(n:User {username: $username})<-[:DEPUTY |:TEAMLEADER]-(g:Group) return (g)-[]->()")
    Group findGroupMembersByTeamLeader(String username);

    //TODO remove
    @Query("match(n:User {username: $username}) where (n)<-[:TEAMLEADER|:DEPUTY]-(:Group) return n")
    Group privilegeCheck(String username);

    @Query("match(n:User {username: $username})<-[:TEAMLEADER|:DEPUTY]-(g:Group) return g.name")
    Set<String> getAvailableGroupsForUser(String username);

}
