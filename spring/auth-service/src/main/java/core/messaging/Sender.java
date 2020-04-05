
package core.messaging;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class Sender {
    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange exchange;

    @Autowired
    private FanoutExchange fanout;

    public Boolean sendCreate(String message) {
        System.out.println("START " + message + " " + LocalDateTime.now());
        Boolean s = (Boolean) template
                .convertSendAndReceive(exchange.getName(),
                        "createAuth",
                        message);
        System.out.println("RECEIVED " + message + " RESULT " +  s + " " + LocalDateTime.now());
        return s;
    }

    public void sendDelete(String message) {
        template.convertAndSend(fanout.getName(),"user.delete" ,message);
    }


}
