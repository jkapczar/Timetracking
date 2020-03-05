package auth.service;

import auth.dao.UserDao;
import auth.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {

    private UserDao userDao;

    @Autowired
    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User findUserByUsername(String username) throws Exception {
        return userDao.findByUsername(username);
    }

    public User findUserById(Long id) throws Exception {
        return userDao.findById(id);
    }

    public void createUser(User u) throws Exception {
        userDao.save(u);
    }

    public void updateUser(User u) throws Exception {
        userDao.update(u);
    }

    public void updateUserStatus(String username) throws Exception {
        userDao.updateStatus(username);
    }
}
