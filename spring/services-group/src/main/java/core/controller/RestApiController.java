package core.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.GroupDao;
import core.dao.UserDao;
import core.model.Group;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
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
            Group current = mapper.readValue(body, Group.class);
            Group old = groupDao.findGroupByName(current.getName());

            System.out.println(current);

            //Members
            Set<String> needsToBeUpdated = new HashSet<>();
            Set<String> needsToBeRemoved = new HashSet<>();

            needsToBeUpdated.addAll(current.getMembers().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));
            needsToBeUpdated.removeAll(old.getMembers().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));

            needsToBeRemoved.addAll(old.getMembers().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));
            needsToBeRemoved.removeAll(current.getMembers().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));

            Set<User> updated = userDao.findUsersByUsername(needsToBeUpdated);
            Set<User> removed = userDao.findUsersByUsername(needsToBeRemoved);

            for (User u: updated) {
                old.addMember(u);
            }
            for (User u: removed) {
                old.removeMember(u);
            }

            //Deputies
            needsToBeUpdated = new HashSet<>();
            needsToBeRemoved = new HashSet<>();

            needsToBeUpdated.addAll(current.getDeputies().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));
            needsToBeUpdated.removeAll(old.getDeputies().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));

            needsToBeRemoved.addAll(old.getDeputies().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));
            needsToBeRemoved.removeAll(current.getDeputies().stream()
                    .map(e->e.getUsername()).collect(Collectors.toSet()));

            updated = userDao.findUsersByUsername(needsToBeUpdated);
            removed = userDao.findUsersByUsername(needsToBeRemoved);

            for (User u: updated) {
                old.addDeputy(u);
            }
            for (User u: removed) {
                old.removeDeputy(u);
            }

            //TeamLeader
            if (current.getTeamLeader()==null && old.getTeamLeader()!=null) {
                old.removeTeamLeader(old.getTeamLeader());
            } else if (old.getTeamLeader() == null ||
                    !current.getTeamLeader().getUsername()
                            .equals(old.getTeamLeader().getUsername())) {
                User newTeamLeader = userDao.findUserByUserName(current.getTeamLeader().getUsername());
                old.addTeamLeader(newTeamLeader);
            }

            Group g = groupDao.save(old);

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

            System.out.println(u);

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

    @RequestMapping(value = "/availableTeamLeaders", method = RequestMethod.GET)
    public ResponseEntity<Set<String>> getAvailableTeamLeaders() {
        Set<String> users = new HashSet<>();
        try {
            users = this.userDao.findAvailableTeamLeaders();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/teamLeaders", method = RequestMethod.GET)
    public ResponseEntity<Set<String>> getTeamLeaders() {
        Set<String> users = new HashSet<>();
        try {
            users = this.userDao.findTeamLeaders();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @RequestMapping(value = "/allUnassignedUsers", method = RequestMethod.GET)
    public ResponseEntity<Set<String>> getAllUnassignedUsers() {
        Set<String> users = new HashSet<>();
        try {
            users = this.userDao.findAllUnassignedUsers();
            return new ResponseEntity<>(users, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(users, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = {"/allGroups"}, method = RequestMethod.GET)
    public ResponseEntity<Set<String>> getAllGroup() {
        Set<String> groupNames = new HashSet<>();
        try {
            groupNames = this.groupDao.getGroupNames();
            return new ResponseEntity<>(groupNames, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(groupNames, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = {"/allUsers"}, method = RequestMethod.GET)
    public ResponseEntity<Set<String>> getAllUsers() {
        Set<String> userNames = new HashSet<>();
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
