package core.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import core.dao.GroupDao;
import core.dao.UserDao;
import core.model.User;
import core.model.UserRole;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;


public class Receiver {
    @Autowired
    private Sender sender;

    @Autowired
    private UserDao userDao;

    @Autowired
    private GroupDao groupDao;

    @RabbitListener(queues = "user.createUser.requests")
    public Boolean createUser(String username) {
        Boolean s = null;
        User u = new User();
        u.setUsername(username);

        try {
            this.userDao.save(u);
            s = this.sender.send(username);
        } catch (Exception e ) {
            e.printStackTrace();
            return  false;
        }

        if (s == null || !s) {
            this.userDao.deleteUserByUsername(u.getUsername());
            return false;
        }
        return true;
    }

    @RabbitListener(queues = "#{autoDeleteQueue.name}")
    public void deleteUser(String username) {
        System.out.println(username);
        try {
            this.userDao.deleteUserByUsername(username);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @RabbitListener(queues = "group.privilege.requests")
    public String getUserPrivilege(String username) {
        try {
            System.out.println(username);
            User u = this.userDao.findUserByUserName(username);
            UserRole ur = new UserRole(u);
            ObjectMapper mapper = new ObjectMapper();
            String result = null;
            result = mapper.writeValueAsString(ur);
            System.out.println(result);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    @RabbitListener(queues = "group.member.requests")
    public String getUserMemberStatus(String username) {
        System.out.println(username);
        String member = this.groupDao.getMemberStatusOfUser(username);
        return member;
    }

}
