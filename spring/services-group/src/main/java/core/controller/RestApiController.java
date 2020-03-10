package core.controller;

import core.dao.GroupDao;
import core.model.Group;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/groups"})
public class RestApiController {
    private GroupDao groupDao;

    @Autowired
    public RestApiController(GroupDao groupDao) {
        this.groupDao = groupDao;
    }

    @RequestMapping(value = {"/all"}, method = {RequestMethod.GET})
    public ResponseEntity<String> getAllUsers() {
        List<Group> groups = new ArrayList<>();
        try {
            Group g = new Group();
            g.setName("test");
            groupDao.save(g);

            groups = (List<Group>)StreamSupport.stream(this.groupDao.findAll().spliterator(), false).collect(Collectors.toList());
            System.out.println("size: " + groups.size());
            return new ResponseEntity("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
