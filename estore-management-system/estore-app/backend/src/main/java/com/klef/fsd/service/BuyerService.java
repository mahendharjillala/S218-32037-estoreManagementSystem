package com.klef.fsd.service;

import com.klef.fsd.model.Buyer;

public interface BuyerService {

	public String buyerRegistration(Buyer buyer);

	public Buyer checkBuyerLogin(String email, String password);

	public String generateResetToken(String email);
	public String resetPassword(String token, String newPassword);

}
