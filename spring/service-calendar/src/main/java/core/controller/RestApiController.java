package core.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.EventDao;
import core.dao.UserDao;
import core.model.Event;
import core.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.*;

@RestController
@RequestMapping("/calendar")
public class RestApiController {

    private UserDao userDao;
    private EventDao eventDao;
    private ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private DateTimeFormatter formatter = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd[ HH:mm:ss]")
            .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
            .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

    @Autowired
    public RestApiController(UserDao userDao, EventDao eventDao) {
        this.userDao = userDao;
        this.eventDao = eventDao;
    }

    @RequestMapping(value="/{username}/{start}/{end}" ,method= RequestMethod.GET)
    public ResponseEntity<Set<Event>> findEvents(@PathVariable String username,
                                                 @PathVariable String start,
                                                 @PathVariable String end){
        Set<Event> events = new HashSet<>();
        try {

            LocalDateTime startTime = LocalDateTime.parse(start, formatter);
            LocalDateTime endTime = LocalDateTime.parse(end, formatter);

            System.out.println(startTime + " " + endTime);

            User user = this.userDao.findUserByUsername(username);

            System.out.println(user);

            events = this.eventDao.findEvents(user.getId(), startTime, endTime);

            return new ResponseEntity<>(events, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(events, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // TODO remove get user part
    @RequestMapping(value="/{username}/save" ,method= RequestMethod.POST)
    public ResponseEntity<Set<Event>> saveEvents(@RequestBody String input, @PathVariable String username){
        Set<Event> result = new HashSet<>();
        try {
            User u = this.userDao.findUserByUsername(username);

            List<Event> events = mapper.readValue(input,
                    mapper.getTypeFactory().constructCollectionType(List.class, Event.class));

            for (Event e:events) {
                e.setUser(u);
            }
            result = new HashSet<Event>((Collection) this.eventDao.saveAll(events));
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/delete" ,method= RequestMethod.POST)
    public ResponseEntity<String> deleteEvents(@RequestBody String input){
        try {
            List<Event> events = mapper.readValue(input,
                    mapper.getTypeFactory().constructCollectionType(List.class, Event.class));
            this.eventDao.deleteAll(events);
            return new ResponseEntity<>("", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/{username}" ,method= RequestMethod.GET)
    public ResponseEntity<User> getCalendarOwner(@PathVariable String username){
        User u = null;
        try {
            u = this.userDao.findUserByUsername(username);
            return new ResponseEntity<>(u, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(u, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
