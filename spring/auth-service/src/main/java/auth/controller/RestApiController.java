package auth.controller;


import auth.model.User;
import auth.service.UserService;

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

    @Autowired
    RestApiController(UserService userService, BCryptPasswordEncoder encoder) {
        this.userService = userService;
        this.encoder = encoder;
    }


    @RequestMapping(value="/auth/registration" ,method= RequestMethod.POST)
    public ResponseEntity<String> registration(@RequestBody String input) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            System.out.println(input);
            User u =  mapper.readValue(input, User.class);
            u.setPassword(encoder.encode(u.getPassword()));
            u.setSecAnswer(encoder.encode(u.getSecAnswer()));
            System.out.println(u);
            userService.createUser(u);
            return new ResponseEntity<String>("", HttpStatus.OK);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return new ResponseEntity<String>("", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // TODO pw reset function

}
