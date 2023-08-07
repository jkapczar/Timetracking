package core.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.UserDao;
import core.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/users")
public class RestApiController {

    private UserDao userDao;

    @Autowired
    RestApiController(UserDao userDao) {
        this.userDao = userDao;
    }

    @RequestMapping(value="/all" ,method= RequestMethod.GET)
    public ResponseEntity<Set<String>> getAllUsers(){
        Set<String> users = new HashSet<>();
        try {
            users = userDao.findAllUserNames();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/{username}" ,method= RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable(value="username") String username){
        User user = null;
        try {
            user = userDao.findByUsername(username);
            System.out.println(user);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(user, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/update" ,method= RequestMethod.POST)
    public ResponseEntity<String> updateUser(@RequestBody String input){
        ObjectMapper mapper = new ObjectMapper();
        try {
            User u =  mapper.readValue(input, User.class);
            userDao.save(u);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/delete/{username}" ,method= RequestMethod.DELETE)
    public ResponseEntity<String> deleteUser(@PathVariable(value="username") String username){
        System.out.println("deleting " + username);
        try {
            userDao.deleteUserByUserName(username);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
