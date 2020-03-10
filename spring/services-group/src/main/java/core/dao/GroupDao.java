package core.dao;

import core.model.Group;
import org.springframework.data.repository.CrudRepository;

public interface GroupDao extends CrudRepository<Group, Long> {
    Group getGroupByName(String paramString);
}
