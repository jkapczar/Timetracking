package core;

import core.messaging.Receiver;
import core.messaging.Sender;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
    @Bean(name = "memberExchange")
    public DirectExchange memberExchange() {
        return new DirectExchange("group.member");
    }

    @Bean
    public FanoutExchange fanout() {
        return new FanoutExchange("user.delete");
    }

    @Bean
    public Queue autoDeleteQueue() {
        return new AnonymousQueue();
    }

    @Bean
    public Binding fanOutBinding(FanoutExchange fanout,
                                 Queue autoDeleteQueue) {
        return BindingBuilder.bind(autoDeleteQueue)
                .to(fanout);
    }

    @Bean(name = "calendarExchange")
    public DirectExchange calendarExchange() {
        return new DirectExchange("user.createCalendar");
    }

    @Bean
    public Queue queue() {
        return new Queue("user.createCalendar.requests");
    }

    @Bean
    public Binding binding(DirectExchange calendarExchange,
                           Queue queue) {
        return BindingBuilder.bind(queue)
                .to(calendarExchange)
                .with("createCalendar");
    }
    @Bean
    public Sender sender() {
        return new Sender();
    }
    @Bean
    public Receiver receiver() {
        return new Receiver();
    }

}
