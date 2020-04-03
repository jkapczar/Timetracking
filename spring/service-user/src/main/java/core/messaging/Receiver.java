package core.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.UserDao;
import core.model.User;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;


public class Receiver {
    @Autowired
    private Sender sender;

    @Autowired
    private UserDao userDao;

    private ObjectMapper mapper = new ObjectMapper();

    @RabbitListener(queues = "user.createAuth.requests")
    public Boolean receive(String input) {
        System.out.println("RECEIVED IN USER " + LocalDateTime.now().toString());
        System.out.println(input);
        User u = null;
        Boolean result = null;
        try {
            u = mapper.readValue(input, User.class);
            System.out.println(u);
            this.userDao.save(u);
            result = this.sender.send(u.getUsername());
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }

        if (result == null || !result) {
            System.out.println("removing");
            this.userDao.deleteUserByUserName(u.getUsername());
            return false;
        }

        return true;
    }
}
