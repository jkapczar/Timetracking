package core.dao;

import core.model.User;
import org.springframework.stereotype.Repository;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import java.util.List;

// TODO return firstname lastname combinations by usernames for multiple users at once

@Repository
public class UserDao {

    @PersistenceContext
    private EntityManager em;

    public User findByUsername(String username) throws Exception {
        try {
            return em.createNamedQuery("User.findUsername", User.class).setParameter("username", username).getSingleResult();
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    public User findById(Long id) throws Exception {
        try {
            return em.createNamedQuery("User.findById", User.class).setParameter("id", id).getSingleResult();
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    public List<String> findAll() throws Exception {
        try{
            return em.createNamedQuery("User.findAll", String.class).getResultList();
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    public void save(User u) throws Exception {
        try {
            em.persist(u);
        }catch (Exception e) {
            throw new Exception(e);
        }
    }

    public User update(User u) throws Exception {
        try {
            return em.merge(u);
        } catch (Exception e) {
            throw new Exception(e);
        }
    }

    public void deleteByUsername(String username) throws Exception {
        try {
            em.createNamedQuery("User.deleteUsername").setParameter("username", username).executeUpdate();
        }catch (Exception e) {
            throw new Exception(e);
        }
    }

}
