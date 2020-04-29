package core.messaging;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import core.services.MailSending;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
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
                    + "Please activate your account by clicking on the link below! <br><br>"
                    + "<a href=\"http://localhost:8762/auth/confirm?token=" + token + "\"" + ">Link</a>";
            this.mailSending.SendMail(mailTo, content);
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @RabbitListener(queues = "passwordReset")
    public void passwordReset(String input) {
        System.out.println(input);
        try {
            JsonNode jsonNodeRoot = mapper.readTree(input);
            String username = jsonNodeRoot.get("username").asText();
            String token = jsonNodeRoot.get("token").asText();
            JsonNode user = jsonNodeRoot.get("userDetails");
            String mailTo = user.get("email").asText();
            String secQuestion = user.get("secQuestion").asText();
            String encodedQuestion = URLEncoder.encode(secQuestion, StandardCharsets.UTF_8.toString());

            String content = "Dear <b> " + username + "</b>!<br><br>"
                    + "You can reset your password by clicking the link below! <br><br>"
                    + "<a href=\"http://localhost:4200/resetpassword?token=" + token + "seqQuestion="
                    + encodedQuestion + "\"" + ">Link</a>";

            this.mailSending.SendMail(mailTo, content);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
