package core.dao;

import core.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Transactional
public interface UserDao extends CrudRepository<User, Long> {

    @Query("Select u from User u where u.username = :username")
    public User findByUsername(@Param("username")String username);

    @Query("Select u.username from User u")
    public Set<String> findAllUserNames();

    @Modifying
    @Query("Delete from User u where u.username = :username")
    public void deleteUserByUserName(@Param("username") String username);


}
