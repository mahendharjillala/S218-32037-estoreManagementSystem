package com.klef.fsd.service;

import java.io.UnsupportedEncodingException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.klef.fsd.model.EmailDetails;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender javaMailSender;

	 final String sender = "llcart2024@gmail.com";

	public String sendHtmlMail(EmailDetails details) {
		try {
			MimeMessage message = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setFrom("llcart2024@gmail.com", "LL-Cart Support"); // ✅ From name customized
			helper.setTo(details.getRecipient());
			helper.setSubject(details.getSubject());
			helper.setText(details.getMsgBody(), true); // ✅ true = HTML mode

			javaMailSender.send(message);
			return "Mail Sent Successfully...";
		} catch (MessagingException | UnsupportedEncodingException e) {
			e.printStackTrace();
			return "Error while Sending Mail";
		}
	}
}