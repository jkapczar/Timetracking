package core.dao;

import core.model.User;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface UserDao extends CrudRepository<User, Long> {
    @Query("MATCH (n:User) return n.username")
    List<String> getUserNames();

    @Query("MATCH (n:User {username: $username}) return n")
    User findUserByUserName(String username);

    @Query("MATCH(n:User) where not  (n) <- [:MEMBER] - (:Group) return n.username")
    List<String> findAllUnassignedUsers();
}
