package core.dao;

import core.model.User;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Transactional
public interface UserDao extends CrudRepository<User, Long> {

    @Query("Select u from User u where u.username = :username")
    User findByUsername(@Param("username") String username);

    @Modifying
    @Query("Update User u set u.active = CASE u.active WHEN TRUE THEN FALSE ELSE TRUE END where u.username = :username")
    void updateStatus(@Param("username") String username);

    @Modifying
    @Query("Update User u set u.admin = CASE u.admin WHEN TRUE THEN FALSE ELSE TRUE END where u.username = :username")
    void updateAdmin(@Param("username") String username);

    @Modifying
    @Query("Delete from User u where u.username = :username")
    void deleteUserByUserName(@Param("username") String username);

}
