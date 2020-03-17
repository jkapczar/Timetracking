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
}
