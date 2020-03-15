package core.dao;

import core.model.Group;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GroupDao extends CrudRepository<Group, Long> {
    @Query("MATCH (n:Group) return n.name")
    List<String> getGroupNames();


    // TODO return users ands relationships as well
    // https://community.neo4j.com/t/spring-boot-ogm-relationship-is-not-getting-mapped-in-nodeentity/3510
    @Query("MATCH (n:Group {name: $name})-[r]->(u:User) return *")
    Group findGroupByName(String name);
}
