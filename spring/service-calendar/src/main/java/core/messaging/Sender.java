
package core.messaging;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class Sender {
    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange memberExchange;

    public String getMemberStatus(String message) {
        System.out.println("START " + message + " " + LocalDateTime.now());
        String result = (String) template
                .convertSendAndReceive(memberExchange.getName(),
                        "member",
                        message);
        System.out.println("RECEIVED " + message + " RESULT " +  result + " " + LocalDateTime.now());
        return result;
    }


}
