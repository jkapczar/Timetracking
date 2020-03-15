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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping({"/groups"})
public class RestApiController {

    private GroupDao groupDao;
    private UserDao userDao;
    private ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public RestApiController(GroupDao groupDao, UserDao userDao) {
        this.groupDao = groupDao;
        this.userDao = userDao;
    }

    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public ResponseEntity<String> createGroup(@RequestBody String body) {

        Group group = new Group();
        try {
            JsonNode jsonNodeRoot = mapper.readTree(body);
            User teamLeader = this.userDao.findUserByUserName(jsonNodeRoot.get("teamLeader").asText());
            System.out.println(teamLeader.getUsername());
            group.setName(jsonNodeRoot.get("groupName").asText());
            group.setTeamLeader(teamLeader);
            this.groupDao.save(group);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO create group object from body
    @RequestMapping(value = "/update", method = RequestMethod.POST)
    public ResponseEntity<String> updateGroup(@RequestBody String body) {

        try {
            JsonNode jsonNodeRoot = mapper.readTree(body);
            Group old = mapper.readValue(body, Group.class);
            Group group = groupDao.findGroupByName(jsonNodeRoot.get("name").asText());

            System.out.println(body);
            System.out.println(old);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    @Transactional
    public ResponseEntity<String> testGroup(@RequestBody String body) {
        try {

            User u = userDao.findUserByUserName("u4");
            Group g = groupDao.findGroupByName("test2");

            g.removeMember(u);
            groupDao.save(g);

            /*
            User u = userDao.findUserByUserName("u1");
            Group g = groupDao.findGroupByName("test2");
            u.setMemberOf(g);
            userDao.save(u);
*/


            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/test2", method = RequestMethod.GET)
    public ResponseEntity<String> testGroup2(@RequestBody String body) {
        try {
            User u1 = new User();
            User u2 = new User();
            User u3 = new User();
            User u4 = new User();
            u1.setUsername("u1");
            u2.setUsername("u2");
            u3.setUsername("u3");
            u4.setUsername("u4");
            Group g = new Group();
            Group g2 = new Group();
            g.setName("test");
            g.getMembers().add(u1);
            g.getMembers().add(u2);
            g2.setName("test2");
            g2.getMembers().add(u3);
            g2.getMembers().add(u4);
            groupDao.save(g);
            groupDao.save(g2);

            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/get/{groupName}", method = RequestMethod.GET)
    public ResponseEntity<Group> getGroup(@PathVariable String groupName) {
        Group group = null;
        try {
             group = this.groupDao.findGroupByName(groupName);
            return new ResponseEntity<>(group, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(group, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/allUnassignedUsers", method = RequestMethod.GET)
    public ResponseEntity<List<String>> getAllUnassignedUsers() {
        List<String> users = new ArrayList<>();
        try {
            users = this.userDao.findAllUnassignedUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = {"/allGroups"}, method = RequestMethod.GET)
    public ResponseEntity<List<String>> getAllGroup() {
        List<String> groupNames = new ArrayList<>();
        try {
            groupNames = this.groupDao.getGroupNames();
            return new ResponseEntity<>(groupNames, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(groupNames, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = {"/allUsers"}, method = RequestMethod.GET)
    public ResponseEntity<List<String>> getAllUsers() {
        List<String> userNames = new ArrayList<>();
        try {
            userNames = this.userDao.getUserNames();
            return new ResponseEntity<>(userNames, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(userNames, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/delete/{groupName}", method = RequestMethod.DELETE)
    public ResponseEntity<String> deleteGroup(@PathVariable String groupName) {
        try {
            Group group = this.groupDao.findGroupByName(groupName);
            this.groupDao.delete(group);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
