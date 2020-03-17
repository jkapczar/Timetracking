package core.dao;

import core.model.User;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;

public interface UserDao extends CrudRepository<User, Long> {
    @Query("MATCH (n:User) return n.username")
    Set<String> getUserNames();

    @Query("MATCH (n:User {username: $username}) optional match (n)<-[r]-(g:Group) return *")
    User findUserByUserName(String username);

    @Query("match (n:User) where n.username in $usernames optional match (n)<-[r]-(g:Group) return *")
    Set<User> findUsersByUsername(Set<String> usernames);

    @Query("MATCH(n:User) where not  (n)<-[]-(:Group) return n.username")
    Set<String> findAllUnassignedUsers();

    @Query("match (n:User) where not (n)<-[:TEAMLEADER]-(:Group) return n.username")
    Set<String> findAvailableTeamLeaders();

    @Query("match (n:User) where (n)<-[:TEAMLEADER]-(:Group) return n.username")
    Set<String> findTeamLeaders();

}
