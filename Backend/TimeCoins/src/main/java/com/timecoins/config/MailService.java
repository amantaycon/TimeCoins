package com.timecoins.config;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlVerificationEmail(String to, String name, String token) {
        String link = "http://localhost:5173/u/verify?token=" + token;

        String htmlContent = String.format(HTML_TEMPLATE, name, link); // Replace placeholders

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("sacoser3@gmail.com");
            helper.setTo(to);
            helper.setSubject("Confirm Your Email - TimeCoins");
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send email", e);
        }
    }
    
    public void sendPasswordResetEmail(String to, String name, String token) {
        String resetLink = "http://localhost:5173/u/reset-password?token=" + token;

        String htmlContent = String.format(PASSWORD_RESET_TEMPLATE, name, resetLink);

        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom("sacoder3@gmail.com");
            helper.setTo(to);
            helper.setSubject("Reset Your TimeCoins Password 🔐");
            helper.setText(htmlContent, true); // Enable HTML

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }


    private static final String HTML_TEMPLATE = """
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Confirm Your Email</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f6f8;
              padding: 20px;
              color: #333;
            }
            .container {
              background-color: #ffffff;
              border-radius: 8px;
              padding: 30px;
              max-width: 600px;
              margin: auto;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .btn {
              background-color: #4a90e2;
              color: white;
              padding: 12px 20px;
              text-decoration: none;
              border-radius: 5px;
              display: inline-block;
              margin-top: 20px;
            }
            .footer {
              margin-top: 40px;
              font-size: 12px;
              color: #777;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Welcome to <span style="color:#4a90e2">TimeCoins</span> 🎉</h2>
            <p>Hi <strong>%s</strong>,</p>
            <p>Thanks for signing up! To start using your account, please confirm your email address by clicking the button below:</p>
            
            <a class="btn" href="%s" target="_blank">Confirm My Email</a>
            
            <p style="margin-top:20px;">This link will expire in <strong>1 hour</strong>.</p>
            
            <p>If you did not sign up for TimeCoins, you can safely ignore this email.</p>
            
            <div class="footer">
              <p>Need help? Contact us at <a href="mailto:support@timecoins.com">support@timecoins.com</a></p>
              <p>&copy; 2025 TimeCoins. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
        """;
    
    private static final String PASSWORD_RESET_TEMPLATE = """
    		<!DOCTYPE html>
    		<html>
    		<head>
    		  <meta charset="UTF-8">
    		  <title>Reset Your Password</title>
    		  <style>
    		    body {
    		      font-family: Arial, sans-serif;
    		      background-color: #f4f6f8;
    		      padding: 20px;
    		      color: #333;
    		    }
    		    .container {
    		      background-color: #ffffff;
    		      border-radius: 8px;
    		      padding: 30px;
    		      max-width: 600px;
    		      margin: auto;
    		      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    		    }
    		    .btn {
    		      background-color: #e94e77;
    		      color: white;
    		      padding: 12px 20px;
    		      text-decoration: none;
    		      border-radius: 5px;
    		      display: inline-block;
    		      margin-top: 20px;
    		    }
    		    .footer {
    		      margin-top: 40px;
    		      font-size: 12px;
    		      color: #777;
    		    }
    		  </style>
    		</head>
    		<body>
    		  <div class="container">
    		    <h2>Password Reset Requested 🔐</h2>
    		    <p>Hi <strong>%s</strong>,</p>

    		    <p>We received a request to reset your password for your TimeCoins account.</p>

    		    <p>If this was you, click the button below to reset your password:</p>

    		    <a class="btn" href="%s" target="_blank">Reset My Password</a>

    		    <p style="margin-top:20px;">This link will expire in <strong>1 hour</strong> for your security.</p>

    		    <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>

    		    <div class="footer">
    		      <p>Need help? Contact us at <a href="mailto:support@timecoins.com">support@timecoins.com</a></p>
    		      <p>&copy; 2025 TimeCoins. All rights reserved.</p>
    		    </div>
    		  </div>
    		</body>
    		</html>
    		""";

}

