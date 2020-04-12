package core;

import core.services.MailSending;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MailConfig {
    @Bean
    public MailSending mailSending() {
        return new MailSending();
    }
}
