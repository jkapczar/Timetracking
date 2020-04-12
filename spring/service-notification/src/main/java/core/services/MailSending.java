package core.services;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;

import java.io.IOException;

public class MailSending {
    public void SendMail(String to, String content) {
        Email from = new Email("mycalendarapp2020@gmail.com");
        String subject = "Sending with SendGrid is Fun";
        Email mailTo = new Email(to);
        Content mailContent = new Content("text/html charset=UTF-8", content);
        Mail mail = new Mail(from, subject, mailTo, mailContent);

        // TODO systemenv with docker?
        SendGrid sg = new SendGrid("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");
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);
            System.out.println(response.getStatusCode());
            System.out.println(response.getBody());
            System.out.println(response.getHeaders());
        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }
}
