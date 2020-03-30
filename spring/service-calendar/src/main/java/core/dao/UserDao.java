package core.dao;


import core.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;


public interface UserDao extends CrudRepository<User, Long> {
    @Query("select u from User u where u.username = :username")
    public User findUserByUsername(@Param("username") String username);
}
