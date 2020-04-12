package core;

import core.messaging.Receiver;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
    @Bean
    public Queue registration() {
        return new Queue("registration");
    }

    @Bean
    public Receiver receiver() {
        return new Receiver();
    }

}
