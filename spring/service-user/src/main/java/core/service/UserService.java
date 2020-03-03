package core.service;

import core.dao.UserDao;
import core.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class UserService {
    private UserDao userDao;

    @Autowired
    public UserService (UserDao userDao) {
        this.userDao = userDao;
    }

    public List<String> findAllUsers() throws Exception {
        return userDao.findAll();
    }

    public User findUserByUsername(String username) throws Exception {
        return userDao.findByUsername(username);
    }

    public User updateUser(User user) throws Exception {
        return userDao.update(user);
    }

}
