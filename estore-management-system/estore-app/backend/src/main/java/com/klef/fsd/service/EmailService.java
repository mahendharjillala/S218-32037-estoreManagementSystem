package com.klef.fsd.service;

import com.klef.fsd.model.EmailDetails;

public interface EmailService {
	public String sendHtmlMail(EmailDetails details);
}
