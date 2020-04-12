package core.controller;


import core.dao.TokenDao;
import core.dao.UserDao;
import core.messaging.Sender;
import core.model.Token;
import core.model.User;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.UUID;

@RestController
public class RestApiController {
    private UserDao userDao;
    private TokenDao tokenDao;
    private BCryptPasswordEncoder encoder;
    private Sender sender;
    private ObjectMapper mapper = new ObjectMapper();


    @Autowired
    RestApiController(UserDao userDao, TokenDao tokenDao, BCryptPasswordEncoder encoder, Sender sender) {
        this.userDao = userDao;
        this.tokenDao = tokenDao;
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
            u.setPassword(encoder.encode(credentials.get("password").asText()));
            u.setSecQuestion(credentials.get("secQuestion").asText());
            u.setSecAnswer(encoder.encode(credentials.get("secAnswer").asText()));
            System.out.println(u);

            User tmp = this.userDao.findByUsername(u.getUsername());

            if (tmp != null) {
                return new ResponseEntity<>("Username already exists", HttpStatus.CONFLICT);
            }

            u = this.userDao.save(u);

            Token token = new Token();
            token.setToken(UUID.randomUUID().toString());
            token.setUsername(u.getUsername());
            token.setUserDetails(input);
            token = this.tokenDao.save(token);

            this.sender.sendRegistration(mapper.writeValueAsString(token));

            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @RequestMapping(value="/auth/confirm" ,method= RequestMethod.GET)
    public ResponseEntity<String> confirmRegistration(@RequestParam(value = "token", required = true) String tokenParam) {
        HttpHeaders headers = new HttpHeaders();
        try {
            System.out.println(tokenParam);
            Token token = this.tokenDao.findToken(tokenParam);
            System.out.println(token);
            User u = this.userDao.findByUsername(token.getUsername());
            u.setActive(true);
            u = this.userDao.save(u);

            Boolean result = createUser(u, token.getUserDetails());

            if (result) {
                this.tokenDao.delete(token);
                headers.add("Location", "http://localhost:4200/login");
            } else {
                headers.add("Location", "http://localhost:4200/error");
            }
            return new ResponseEntity<>(headers, HttpStatus.FOUND);
        } catch (Exception e) {
            e.printStackTrace();
        }
        headers.add("Location", "http://localhost:4200/error");
        return new ResponseEntity<>(headers, HttpStatus.FOUND);
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

    @RequestMapping(value="/auth/admin/{username}" ,method= RequestMethod.POST)
    public ResponseEntity<String> updateAdmin(@PathVariable String username) {
        try {
            System.out.println("change admin" + username);
            userDao.updateAdmin(username);
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

    @RequestMapping(value="/auth/delete/{username}" ,method= RequestMethod.POST)
    public ResponseEntity<String> deleteUser(@PathVariable String username) {
        Boolean result = null;
        try {
            this.userDao.deleteUserByUserName(username);
            this.sender.sendDelete(username);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    private boolean createUser(User user, String input) {
       Boolean s = null;
       try {
           s = this.sender.sendCreate(input);
       } catch (Exception e) {
           e.printStackTrace();
           return false;
       }
       if (s == null || !s) {
           this.userDao.delete(user);
           System.out.println("deleted");
           return false;
       }
       return true;
    }

    // TODO pw reset function

}
