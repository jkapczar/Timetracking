
package core.messaging;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
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

    public Boolean sendCreate(String username) {
        Boolean s = (Boolean) template
                .convertSendAndReceive(userExchange.getName(), "createAuth", username);
        return s;
    }

    public void sendDelete(String username) {
        template.convertAndSend(fanout.getName(),"user.delete", username);
    }

    public Set<String> sendUserPrivilegeRequest(String username) {
        Set<String> roles = (Set<String>) template
                .convertSendAndReceive(groupExchange.getName(), "privilege", username);
        return roles;
    }


}
