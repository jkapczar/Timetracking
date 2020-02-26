package core.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.UserDao;
import core.model.User;
import core.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/users")
public class LoginController {

    private UserService userService;

    @Autowired
    LoginController (UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value="/all" ,method= RequestMethod.GET)
    public ResponseEntity<List<User>> getAllUsers(){
        List<User> users = new ArrayList<>();
        try {
            users = userService.findAllUsers();
            return new ResponseEntity<List<User>>(users, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<List<User>>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/{username}" ,method= RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable(value="username") String username){
        User user = null;
        try {
            user = userService.findUserByUsername(username);
            System.out.println(user);
            return new ResponseEntity<User>(user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<User>(user, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
