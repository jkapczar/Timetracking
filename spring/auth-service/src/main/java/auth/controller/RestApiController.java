package auth.controller;


import auth.model.User;
import auth.service.UserService;

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
    private UserService userService;
    private BCryptPasswordEncoder encoder;
    private ObjectMapper mapper = new ObjectMapper();


    @Autowired
    RestApiController(UserService userService, BCryptPasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
    }

    @RequestMapping(value="/auth/{username}" ,method= RequestMethod.GET)
    public ResponseEntity<User> getUser(@PathVariable String username) {
        User user = null;
        try {
            user = userService.findUserByUsername(username);
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
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
            JsonNode creds = jsonNodeRoot.get("creds");
            u.setPassword(creds.get("password").asText());
            u.setSecQuestion(creds.get("secQuestion").asText());
            u.setSecAnswer(creds.get("secAnswer").asText());
            System.out.println(u);
            u.setPassword(encoder.encode(u.getPassword()));
            u.setSecAnswer(encoder.encode(u.getSecAnswer()));
            System.out.println(u);
            userService.createUser(u);
            return new ResponseEntity<>("", HttpStatus.OK);
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
            userService.updateUserStatus(username);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
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
            oldUser = userService.findUserById(u.getId());
            if (!u.getPassword().equals(oldUser.getPassword())) {
                oldUser.setPassword(encoder.encode(u.getPassword()));
            }
            if (!u.getSecAnswer().equals(oldUser.getSecAnswer())) {
                oldUser.setSecAnswer(encoder.encode(u.getSecAnswer()));
            }
            oldUser.setSecQuestion(u.getSecQuestion());
            userService.updateUser(oldUser);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // TODO pw reset function

}
