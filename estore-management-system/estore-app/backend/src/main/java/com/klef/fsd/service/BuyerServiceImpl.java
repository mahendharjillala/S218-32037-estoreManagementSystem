package com.klef.fsd.service;

import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.EmailDetails;
import com.klef.fsd.repository.BuyerRepository;

@Service
public class BuyerServiceImpl implements BuyerService {

	@Autowired
	private BuyerRepository buyerRepository;
	
	
	@Autowired
	private EmailService emailService;

	@Override
	public String buyerRegistration(Buyer buyer) {
		buyerRepository.save(buyer);
		return "Buyer Registered Successfully";
	}

	@Override
	public Buyer checkBuyerLogin(String email, String password) {

		return buyerRepository.findByEmailAndPassword(email, password);
	}

	public String generateResetToken(String email) {
	    Optional<Buyer> buyerOpt = buyerRepository.findByEmail(email);
	    if (buyerOpt.isEmpty()) {
	        return "Seller not found!";
	    }

	    Buyer buyer = buyerOpt.get();
	    String resetToken = UUID.randomUUID().toString();
	    buyer.setResetToken(resetToken);
	    buyerRepository.save(buyer);

	    String resetLink = "https://sdpfrontend-rr9e.onrender.com/reset-password?token=" + resetToken;

	    EmailDetails mail = new EmailDetails();
	    mail.setRecipient(email);
	    mail.setSubject("🔐 Reset Your Password - LL-Cart");

	    String htmlContent = "<h3>Hello from <span style='color:#2563EB;'>LL-Cart</span> 👋</h3>"
	        + "<p>We received a request to reset your password.</p>"
	        + "<p><a href=\"" + resetLink + "\" "
	        + "style='padding:10px 20px; background-color:#2563EB; color:white; text-decoration:none; border-radius:5px;'>"
	        + "Click here to reset your password</a></p>"
	        + "<p>If you didn’t request this, please ignore this email.</p>"
	        + "<br><p>Regards,<br><b>LL-Cart Support Team</b></p>";

	    mail.setMsgBody(htmlContent);
	    emailService.sendHtmlMail(mail);  // ✅ Use HTML method

	    return "Reset link sent to your email";
	}

	    @Override
	    public String resetPassword(String token, String newPassword) {
	        Buyer buyer = buyerRepository.findByResetToken(token);
	        if (buyer == null) {
	            return "Invalid token!";
	        }

	        buyer.setPassword(newPassword); // add encoder if needed
	        buyer.setResetToken(null);
	        buyerRepository.save(buyer);
	        return "Password updated successfully!";
	    }
	
	
}
