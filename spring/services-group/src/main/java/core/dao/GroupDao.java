package core.dao;

import core.model.Group;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface GroupDao extends CrudRepository<Group, Long> {
    @Query("MATCH (n:Group) return n.name")
    List<String> getGroupNames();
}
