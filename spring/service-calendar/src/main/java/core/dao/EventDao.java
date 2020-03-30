package core.dao;

import core.model.Event;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

public interface EventDao extends CrudRepository<Event, Long> {
    @Query("select e from Event e where e.user.username = :username")
    public Set<Event> findEventByUsername(@Param("username") String username);

    @Query("select e from Event e where e.user.id = :id and (e.start >= :start or e.end <= :end)")
    public Set<Event> findEvents(@Param("id") Long id,
                                 @Param("start") LocalDateTime start,
                                 @Param("end") LocalDateTime end);
}
