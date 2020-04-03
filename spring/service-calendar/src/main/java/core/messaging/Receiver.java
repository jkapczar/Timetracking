package core.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.UserDao;
import core.model.User;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;


public class Receiver {
    @Autowired
    private UserDao userDao;

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
}
