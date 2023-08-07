
package core.messaging;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Set;

public class Sender {
    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange userExchange;

    @Autowired
    private DirectExchange groupExchange;

    @Autowired
    private FanoutExchange fanout;

    @Autowired
    private Queue registration;

    @Autowired
    private Queue passwordReset;

    public Boolean sendCreate(String username) {
        return (Boolean) template
                .convertSendAndReceive(userExchange.getName(), "createAuth", username);
    }

    public void sendDelete(String username) {
        template.convertAndSend(fanout.getName(),"user.delete", username);
    }

    public String sendUserPrivilegeRequest(String username) {
        String roles = (String) template
                .convertSendAndReceive(groupExchange.getName(), "privilege", username);
        return roles;
    }

    public void sendRegistration(String token) {
        this.template.convertAndSend(registration.getName(), token);
    }

    public void sendPasswordReset(String token) {
        this.template.convertAndSend(passwordReset.getName(), token);
    }

}
