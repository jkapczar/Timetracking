package core;

import core.messaging.Sender;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
    @Bean
    public DirectExchange exchange() {
        return new DirectExchange("user.createAuth");
    }

    @Bean
    public Sender sender() {
        return new Sender();
    }
}
