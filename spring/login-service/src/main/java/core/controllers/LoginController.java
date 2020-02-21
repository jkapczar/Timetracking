package core.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.UserDao;
import core.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public class LoginController {

    //TODO replace with a service
    private final UserDao userDao;

    @Autowired
    LoginController (UserDao userDao) {
        this.userDao = userDao;
    }

    @RequestMapping(value="/all" ,method= RequestMethod.GET)
    public ResponseEntity<String> getAllUsers(){
        return new ResponseEntity<String>("", HttpStatus.OK);
    }



}
