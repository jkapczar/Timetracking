package core.controller;


import core.dao.UserDao;
import core.messaging.Sender;
import core.model.User;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
public class RestApiController {
    private UserDao userDao;
    private BCryptPasswordEncoder encoder;
    private Sender sender;
    private ObjectMapper mapper = new ObjectMapper();


    @Autowired
    RestApiController(UserDao userDao, BCryptPasswordEncoder encoder, Sender sender) {
        this.userDao = userDao;
        this.encoder = encoder;
        this.sender = sender;
    }

    @RequestMapping(value="/auth/{username}" ,method= RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable String username) {
        User user = null;
        try {
            user = userDao.findByUsername(username);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(user, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value="/auth/registration" ,method= RequestMethod.POST)
    public ResponseEntity<String> registration(@RequestBody String input) {
        try {
            User u =  mapper.readValue(input, User.class);
            JsonNode jsonNodeRoot = mapper.readTree(input);
            JsonNode credentials = jsonNodeRoot.get("creds");
            u.setPassword(credentials.get("password").asText());
            u.setSecQuestion(credentials.get("secQuestion").asText());
            u.setSecAnswer(credentials.get("secAnswer").asText());
            System.out.println(u);
            u.setPassword(encoder.encode(u.getPassword()));
            u.setSecAnswer(encoder.encode(u.getSecAnswer()));
            System.out.println(u);
            Boolean result = createUser(u, input);
            if (result) {
                return new ResponseEntity<>("", HttpStatus.OK);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value="/auth/status/{username}" ,method= RequestMethod.POST)
    public ResponseEntity<String> updateStatus(@PathVariable String username) {
        try {
            System.out.println("change status" + username);
            userDao.updateStatus(username);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value="/auth/update" ,method= RequestMethod.POST)
    public ResponseEntity<String> update(@RequestBody String input) {
        User oldUser = null;
        try {
            User u =  mapper.readValue(input, User.class);
            oldUser = userDao.findById(u.getId()).orElseThrow(Exception::new);
            if (!u.getPassword().equals(oldUser.getPassword())) {
                oldUser.setPassword(encoder.encode(u.getPassword()));
            }
            if (!u.getSecAnswer().equals(oldUser.getSecAnswer())) {
                oldUser.setSecAnswer(encoder.encode(u.getSecAnswer()));
            }
            oldUser.setSecQuestion(u.getSecQuestion());
            userDao.save(oldUser);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean createUser(User user, String input) {
       User u = null;
       Boolean s = null;
       try {
           u = this.userDao.save(user);
           s = this.sender.send(input);
       } catch (Exception e) {
           e.printStackTrace();
           return false;
       }
       if (s == null || !s) {
           this.userDao.delete(u);
           System.out.println("deleted");
           return false;
       }
       return true;
    }

    // TODO pw reset function

}
