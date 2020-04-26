package core.controller;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.EventDao;
import core.dao.EventHistoryDao;
import core.dao.UserDao;
import core.messaging.Sender;
import core.model.Event;
import core.model.EventHistory;
import core.model.Status;
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
import java.util.stream.Collectors;

@RestController
@RequestMapping("/calendar")
public class RestApiController {

    private UserDao userDao;
    private EventDao eventDao;
    private EventHistoryDao eventHistoryDao;
    private Sender sender;
    private ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    private DateTimeFormatter formatter = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd[ HH:mm:ss]")
            .parseDefaulting(ChronoField.HOUR_OF_DAY, 0)
            .parseDefaulting(ChronoField.MINUTE_OF_HOUR, 0)
            .parseDefaulting(ChronoField.SECOND_OF_MINUTE, 0)
            .toFormatter();

    @Autowired
    public RestApiController(UserDao userDao, EventDao eventDao, EventHistoryDao eventHistoryDao, Sender sender) {
        this.userDao = userDao;
        this.eventDao = eventDao;
        this.eventHistoryDao = eventHistoryDao;
        this.sender = sender;
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

            for (Event e: events) {
                if (e.getStatus() == null) {
                    if (e.getGroupId().equals("workTime")) {
                        if (e.getEnd() == null) {
                            e.setBackgroundColor("darkred");
                        } else {
                            e.setBackgroundColor("cornflowerblue");
                        }
                    } else if (e.getGroupId().equals("holiday")) {
                        e.setBackgroundColor("darkblue");
                    } else {
                        e.setBackgroundColor("stateblue");
                    }
                } else {
                    if (e.getGroupId().equals("workTime")) {
                        if (e.getEnd() == null) {
                            e.setBackgroundColor("darkred");
                        } else {
                            if (e.getStatus().equals(Status.PENDING)) {
                                e.setBackgroundColor("darkred");
                            } else if (e.getStatus().equals(Status.ACCEPTED)) {
                                e.setBackgroundColor("cornflowerblue");
                            }
                        }
                    } else if (e.getGroupId().equals("holiday")) {
                        if (e.getStatus().equals(Status.PENDING)) {
                            e.setBackgroundColor("darkred");
                        } else if (e.getStatus().equals(Status.ACCEPTED)) {
                            e.setBackgroundColor("darkblue");
                        }
                    } else {
                        if (e.getStatus().equals(Status.PENDING)) {
                            e.setBackgroundColor("darkred");
                        } else if (e.getStatus().equals(Status.ACCEPTED)) {
                            e.setBackgroundColor("stateblue");
                        }
                    }
                }
            }

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


            if (result != null && !result.isEmpty() && result.stream().anyMatch(e->(e.getStatus() != null && e.getStatus().equals(Status.PENDING)))) {
                System.out.println("history");
                Set<Event> tmp = result.stream().filter(e->e.getHistory() == null && e.getStatus() != null && e.getStatus().equals(Status.PENDING)).collect(Collectors.toSet());
                String member = this.sender.getMemberStatus(username);
                System.out.println(member);
                EventHistory h = new EventHistory();
                h.setEventOwner(username);
                h.setGroupName(member);
                h.setStatus(Status.PENDING);
                h.addEvents(tmp);
                this.eventHistoryDao.save(h);
            }


            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(result, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/delete" ,method= RequestMethod.POST)
    public ResponseEntity<String> deleteEvents(@RequestBody String input){
        try {
            List<Event> tmp = mapper.readValue(input,
                    mapper.getTypeFactory().constructCollectionType(List.class, Event.class));
            Set<Event> events = new HashSet<Event>((Collection) this.eventDao.findAllById(tmp.stream()
                    .map(e->e.getId()).collect(Collectors.toSet())));

            for (Event e: events) {
                if (e.getHistory() != null) {
                    EventHistory h = e.getHistory();
                    h.removeEvent(e);
                    if (h.getEvents().isEmpty()) {
                        this.eventHistoryDao.delete(h);
                    }
                }
            }

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

    @RequestMapping(value="/updateOwner" ,method= RequestMethod.POST)
    public ResponseEntity<User> updateCalendarOwner(@RequestBody String input){
        User u = null;
        try {
            User newUser = mapper.readValue(input, User.class);
            System.out.println(newUser);
            u = this.userDao.save(newUser);
            return new ResponseEntity<>(u, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(u, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/getEventByStatus" ,method= RequestMethod.POST)
    public ResponseEntity<Set<EventHistory>> getHistory(@RequestBody String input){
        Set<EventHistory> h = new HashSet<>();
        try {
            System.out.println(input);
            String status  = mapper.readTree(input).get("status").asText();
            Set<String> usernames = mapper.convertValue(mapper.readTree(input).get("users"), HashSet.class);

            h = this.eventHistoryDao.getEvents(Status.valueOf(status), usernames);

            return new ResponseEntity<>(h, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(h, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/updateEventStatus" ,method= RequestMethod.POST)
    public ResponseEntity<EventHistory> updateHistory(@RequestBody String input){
        EventHistory h = null;
        try {

            String status  = mapper.readTree(input).get("status").asText();
            String id  = mapper.readTree(input).get("id").asText();
            String updatedBy  = mapper.readTree(input).get("updatedBy").asText();

            h = this.eventHistoryDao.findById(Long.valueOf(id)).get();
            User u = this.userDao.findUserByUsername(h.getEventOwner());

            if (status.equals("DECLINED")) {
                System.out.println("DECLINED");
                if (h.getEvents().stream().anyMatch(e->e.getGroupId().equals("holiday"))) {
                    System.out.println("holiday");
                    u.setNumOfHolidays(u.getNumOfHolidays() - h.getEvents().size());
                }
                if (h.getEvents().stream().anyMatch(e->e.getGroupId().equals("homeOffice"))) {
                    System.out.println("HO");
                    u.setNumOfHOs(u.getNumOfHOs() - h.getEvents().size());
                }
            }

            h.setStatus(Status.valueOf(status));
            h.setUpdatedBy(updatedBy);

            for (Event e: h.getEvents()) {
                e.setStatus(Status.valueOf(status));
            }
            this.userDao.save(u);
            h = this.eventHistoryDao.save(h);

            return new ResponseEntity<>(h, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(h, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }



}
