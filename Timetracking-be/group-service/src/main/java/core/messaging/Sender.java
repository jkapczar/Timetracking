
package core.messaging;

import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;

public class Sender {
    @Autowired
    private RabbitTemplate template;

    @Autowired
    private DirectExchange calendarExchange;

    public Boolean send(String message) {
        System.out.println("START " + message + " " + LocalDateTime.now());
        Boolean s = (Boolean) template
                .convertSendAndReceive(calendarExchange.getName(),
                        "createCalendar",
                        message);
        System.out.println("RECEIVED " + message + " RESULT " +  s + " " + LocalDateTime.now());
        return s;
    }


}
