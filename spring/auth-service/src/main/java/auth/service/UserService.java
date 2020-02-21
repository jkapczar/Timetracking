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

    public void createUser(User u) throws Exception {
        userDao.save(u);
    }

    public User findUserByUsername(String username) throws Exception {
        return userDao.findByUsername(username);
    }
}
