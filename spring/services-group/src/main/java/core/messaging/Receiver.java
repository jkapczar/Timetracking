package core.messaging;

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

    @RabbitListener(queues = "user.createUser.requests")
    public Boolean receive(String input)
    {
        System.out.println("RECEIVED IN GROUP " + LocalDateTime.now().toString());
        System.out.println(input);

        Boolean s = null;
        User u = new User();
        u.setUsername(input);

        try {
            userDao.save(u);
            s = this.sender.send(input);
        } catch (Exception e ) {
            e.printStackTrace();
            return  false;
        }

        if (s == null || !s) {
            System.out.println("removing");
            userDao.deleteUserByUsername(u.getUsername());
            return false;
        }
        return true;
    }

    @RabbitListener(queues = "#{autoDeleteQueue.name}")
    public void delete(String input) {
        System.out.println(input);
        try {
            this.userDao.deleteUserByUsername(input);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

}
