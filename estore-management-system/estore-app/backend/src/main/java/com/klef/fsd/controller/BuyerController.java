package com.klef.fsd.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klef.fsd.model.Buyer;
import com.klef.fsd.service.BuyerService;

@RestController
@RequestMapping("/buyer")
@CrossOrigin("*")
public class BuyerController {

	@Autowired
	private BuyerService buyerService;

	@GetMapping("/")
	public String home() {

		return "LL-Cart Home Page";
	}

	@PostMapping("/registration")
	public ResponseEntity<String> buyerRegistration(@RequestBody Buyer buyer) {
		try {
			String output = buyerService.buyerRegistration(buyer);
			return ResponseEntity.ok(output); // 200 - success
		} catch (Exception e) {
			// return ResponseEntity.status(500).body("Registration failed: " +
			// e.getMessage());
			return ResponseEntity.status(500).body("Buyer Regestration is failed...");
		}
	}

	@PostMapping("/checkbuyerlogin")
	public ResponseEntity<?> checkBuyerLogin(@RequestBody Buyer buyer) {
		try {
			Buyer b = buyerService.checkBuyerLogin(buyer.getEmail(), buyer.getPassword());

			if (b != null) {
				return ResponseEntity.ok(b); // if login is successful
			} else {
				return ResponseEntity.status(401).body("Invalid Email or Password"); // if login is fail
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
		}
	}
	
	@PostMapping("/forgot-password")
	public ResponseEntity<String> forgotPassword(@RequestParam String email) {
		String result = buyerService.generateResetToken(email);
		if (result.equals("Buyer not found!")) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
		}
		return ResponseEntity.ok(result);
	}

	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
		String result = buyerService.resetPassword(token, newPassword);
		if (result.equals("Invalid token!")) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
		}
		return ResponseEntity.ok(result);
	}

	
}
