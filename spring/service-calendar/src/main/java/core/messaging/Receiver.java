package core.messaging;

import core.dao.EventDao;
import core.dao.UserDao;
import core.model.User;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;


public class Receiver {
    @Autowired
    private UserDao userDao;

    @Autowired
    private EventDao eventDao;

    @RabbitListener(queues = "user.createCalendar.requests")
    public Boolean receive(String input) {
        System.out.println("RECEIVED IN USER " + LocalDateTime.now().toString());
        System.out.println(input);
        User u = new User();
        u.setUsername(input);

        try {
            this.userDao.save(u);
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        return true;
    }

    @RabbitListener(queues = "#{autoDeleteQueue.name}")
    public void delete(String input) {
        System.out.println(input);
        try {
            User u = userDao.findUserByUsername(input);
            this.eventDao.deleteEventByUserName(u.getId());
            this.userDao.deleteUserByUserName(input);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
