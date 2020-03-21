package core.controller;

import core.dao.UserDao;
import core.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/calendar")
public class RestApiController {

    private UserDao userDao;

    @Autowired
    public RestApiController(UserDao userDao) {
        this.userDao = userDao;
    }

    @RequestMapping(value="/test" ,method= RequestMethod.GET)
    public ResponseEntity<List<User>> test(){
        List<User> users = new ArrayList<>();
        try {
            User u = new User();
            u.setUsername("test2");
            userDao.save(u);
            users = userDao.findAll();
            System.out.println("users: " + users.size());
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
