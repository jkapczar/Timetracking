package core.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.services.MailSending;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.Iterator;

public class Receiver {
    @Autowired
    private MailSending mailSending;

    private ObjectMapper mapper = new ObjectMapper();


    @RabbitListener(queues = "registration")
    public void registration(String input) {
        try{
            System.out.println(input);
            JsonNode jsonNodeRoot = mapper.readTree(input);
            JsonNode userDetailsNode = mapper.readTree(jsonNodeRoot.findValue("userDetails").asText());
            String mailTo = userDetailsNode.get("email").asText();
            String username = jsonNodeRoot.get("username").asText();
            String token = jsonNodeRoot.get("token").asText();
            System.out.println(username + " " + token);

            String content = "Welcome <b> " + username + "</b>!<br><br>"
                    + "Please activate your account by clicking on the link below! "
                    + "<a href=\"http://localhost:8762/auth/confirm?token=" + token + "\"" + ">Link</a>";
            this.mailSending.SendMail(mailTo, content);


        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
