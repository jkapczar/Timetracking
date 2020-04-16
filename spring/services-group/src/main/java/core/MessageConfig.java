package core;

import core.messaging.Receiver;
import core.messaging.Sender;
import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MessageConfig {
    // group
    @Bean(name = "memberExchange")
    public DirectExchange memberExchange() {
        return new DirectExchange("group.member");
    }

    @Bean
    public Queue memberQueue() {
        return new Queue("group.member.requests");
    }

    @Bean
    public Binding memberBinding(DirectExchange memberExchange,
                                Queue memberQueue) {
        return BindingBuilder.bind(memberQueue)
                .to(memberExchange)
                .with("member");
    }

    @Bean(name = "groupExchange")
    public DirectExchange groupExchange() {
        return new DirectExchange("group.privilege");
    }

    @Bean
    public Queue groupQueue() {
        return new Queue("group.privilege.requests");
    }

    @Bean
    public Binding groupBinding(DirectExchange groupExchange,
                           Queue groupQueue) {
        return BindingBuilder.bind(groupQueue)
                .to(groupExchange)
                .with("privilege");
    }
    // user deletion
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
    // user creation
    @Bean(name = "calendarExchange")
    public DirectExchange calendarExchange() {
        return new DirectExchange("user.createCalendar");
    }

    @Bean
    public Sender sender() {
        return new Sender();
    }

    @Bean(name = "userExchange")
    public DirectExchange userExchange() {
        return new DirectExchange("user.createUser");
    }

    @Bean
    public Queue queue() {
        return new Queue("user.createUser.requests");
    }

    @Bean
    public Binding binding(DirectExchange userExchange,
                           Queue queue) {
        return BindingBuilder.bind(queue)
                .to(userExchange)
                .with("createUser");
    }

    @Bean
    public Receiver receiver() {
        return new Receiver();
    }

}
