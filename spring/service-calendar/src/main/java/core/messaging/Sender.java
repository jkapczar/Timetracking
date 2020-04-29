
package core.messaging;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class Sender {
    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange memberExchange;

    public String getMemberStatus(String message) {
        String result = (String) template
                .convertSendAndReceive(memberExchange.getName(),
                        "member",
                        message);
        return result;
    }
}
