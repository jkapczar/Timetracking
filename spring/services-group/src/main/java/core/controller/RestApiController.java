package core.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.GroupDao;
import core.dao.UserDao;
import core.model.Group;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

import core.model.User;
import jdk.nashorn.internal.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/groups"})
public class RestApiController {

    private GroupDao groupDao;
    private UserDao userDao;

    @Autowired
    public RestApiController(GroupDao groupDao, UserDao userDao) {
        this.groupDao = groupDao;
        this.userDao = userDao;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<String> createGroup(@RequestBody String body) {
        ObjectMapper mapper = new ObjectMapper();
        Group group = new Group();
        try {
            JsonNode jsonNodeRoot = mapper.readTree(body);
            User teamLeader = this.userDao.getUserByusername(jsonNodeRoot.get("teamLeader").asText());
            System.out.println(teamLeader.getUsername());
            group.setName(jsonNodeRoot.get("groupName").asText());
            group.setTeamLeader(teamLeader);
            this.groupDao.save(group);
            return new ResponseEntity<String>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO create group object from body
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ResponseEntity<String> updateGroup(@RequestBody String body) {
        Group group = new Group();
        try {
            // User user = userDao.findByUsername()
            group.setName("");
            group.setTeamLeader(null);
            return new ResponseEntity<String>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = {"/allGroups"}, method = RequestMethod.GET)
    public ResponseEntity<List<String>> getAllGroup() {
        List<String> groupNames = new ArrayList<>();
        try {
            groupNames = this.groupDao.getGroupNames();
            return new ResponseEntity(groupNames, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(groupNames, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = {"/allUsers"}, method = RequestMethod.GET)
    public ResponseEntity<List<String>> getAllUsers() {
        List<String> userNames = new ArrayList<>();
        try {
            userNames = this.userDao.getUserNames();
            return new ResponseEntity(userNames, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity(userNames, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //TODO find by group name and delete
    @RequestMapping(value = "/delete", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteGroup(@RequestBody String body) {
        try {
            //Group g = groupDao.findById(null);
            return new ResponseEntity<String>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<String>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
