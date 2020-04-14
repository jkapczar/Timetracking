package core.dao;

import core.model.EventHistory;
import core.model.Status;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional
public interface EventHistoryDao extends CrudRepository<EventHistory, Long> {
    @Query("select e from EventHistory e where e.status = :status and e.eventOwner in :usernames")
    Set<EventHistory> getEvents(@Param("status") Status status, @Param("usernames") Set<String> usernames);
}
