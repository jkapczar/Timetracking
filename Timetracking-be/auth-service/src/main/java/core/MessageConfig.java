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
    public Queue registration() {
        return new Queue("registration");
    }

    @Bean
    public Queue passwordReset() {
        return new Queue("passwordReset");
    }

    @Bean
    public FanoutExchange fanout() {
        return new FanoutExchange("user.delete");
    }

    @Bean
    public DirectExchange userExchange() {
        return new DirectExchange("user.createAuth");
    }

    @Bean
    public DirectExchange groupExchange() {
        return new DirectExchange("group.privilege");
    }

    @Bean
    public Sender sender() {
        return new Sender();
    }
}
