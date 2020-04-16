package core.dao;

import core.model.Event;
import core.model.Status;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Set;

@Transactional
public interface EventDao extends CrudRepository<Event, Long> {
    @Query("select e from Event e where e.user.username = :username")
    public Set<Event> findEventByUsername(@Param("username") String username);

    @Query("select e from Event e where e.user.id = :id and (e.start >= :start and e.start <= :end)")
    public Set<Event> findEvents(@Param("id") Long id,
                                 @Param("start") LocalDateTime start,
                                 @Param("end") LocalDateTime end);
    @Modifying
    @Query("DELETE from Event e where e.user.id = :id")
    public void deleteEventByUserName(@Param("id") Long id);
}
