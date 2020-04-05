package core;

import core.messaging.Sender;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.FanoutExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
    @Bean
    public FanoutExchange fanout() {
        return new FanoutExchange("user.delete");
    }

    @Bean
    public DirectExchange exchange() {
        return new DirectExchange("user.createAuth");
    }

    @Bean
    public Sender sender() {
        return new Sender();
    }
}
