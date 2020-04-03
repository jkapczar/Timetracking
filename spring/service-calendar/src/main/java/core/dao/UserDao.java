package core.dao;


import core.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

@Transactional
public interface UserDao extends CrudRepository<User, Long> {
    @Query("select u from User u where u.username = :username")
    public User findUserByUsername(@Param("username") String username);

    @Modifying
    @Query("Delete from User u where u.username = :username")
    public void deleteUserByUserName(@Param("username") String username);
}
