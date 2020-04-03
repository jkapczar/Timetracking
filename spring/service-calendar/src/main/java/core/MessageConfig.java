package core;

import core.messaging.Receiver;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {

    @Bean(name = "calendarExchange")
    public DirectExchange calendarExchange() {
        return new DirectExchange("user.createCalendar");
    }

    @Bean
    public Queue queue() {
        return new Queue("user.createCalendar.requests");
    }

    @Bean
    public Binding binding(DirectExchange authExchange,
                           Queue queue) {
        return BindingBuilder.bind(queue)
                .to(authExchange)
                .with("createCalendar");
    }

    @Bean
    public Receiver receiver() {
        return new Receiver();
    }

}
