package com.klef.fsd.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.fsd.model.EmailDetails;
import com.klef.fsd.model.Order;
import com.klef.fsd.model.Seller;
import com.klef.fsd.repository.OrderRepository;
import com.klef.fsd.repository.ProductRepository;
import com.klef.fsd.repository.SellerRepository;

@Service
public class SellerServiceImpl implements SellerService {

	@Autowired
	private SellerRepository sellerRepository;

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private EmailService emailService;

	@Override
	public String sellerRegistration(Seller seller) {
		seller.setStatus("Pending");
		sellerRepository.save(seller);
		return "Seller Registered Successfully!";
	}

	@Override
	public Seller checkSellerLogin(String username, String password) {
		Seller seller = sellerRepository.findByUsernameAndPassword(username, password);
		if (seller != null && "Approved".equalsIgnoreCase(seller.getStatus())) {
			return seller;
		}
		return null;
	}

	@Override
	public List<Seller> viewPendingSellers() {
		return sellerRepository.findByStatus("Pending");
	}

	@Override
	public String approveSeller(int sellerId) {
		Optional<Seller> optionalSeller = sellerRepository.findById(sellerId);
		if (optionalSeller.isPresent()) {
			Seller seller = optionalSeller.get();
			seller.setStatus("Approved");
			sellerRepository.save(seller);
			return "Seller approved successfully.";
		} else {
			return "Seller not found.";
		}
	}

	@Override
	public String rejectSeller(int id) {
		Optional<Seller> optionalSeller = sellerRepository.findById(id);
		if (optionalSeller.isPresent()) {
			Seller seller = optionalSeller.get();
			seller.setStatus("Rejected");
			sellerRepository.save(seller);
			return "Seller rejected successfully";
		} else {
			return "Seller not found";
		}
	}

	@Override
	public String deleteSeller(int id) {
		Optional<Seller> optionalSeller = sellerRepository.findById(id);
		if (optionalSeller.isPresent()) {
			sellerRepository.deleteById(id);
			return "Seller deleted successfully";
		} else {
			return "Seller not found";
		}
	}

	@Override
	public Seller getSellerById(int sid) {

		return sellerRepository.findById(sid).get();
	}

	@Override
	public String updateSellerProfile(Seller seller) {
		Optional<Seller> optionalSeller = sellerRepository.findById(seller.getId());
		if (optionalSeller.isPresent()) {

			Seller s = optionalSeller.get();
			s.setLocation(seller.getLocation());
			s.setMobileno(seller.getMobileno());
			s.setNationalidno(seller.getNationalidno());
			s.setUsername(s.getUsername());
			s.setEmail(seller.getEmail());
			sellerRepository.save(s);
			return "Seller Updated Successfully";
		} else {
			return "Seller not found";
		}

	}

	@Override
	public List<Seller> viewAllSellers() {

		return sellerRepository.findAll();
	}

	@Override
	public String generateResetToken(String email) {
		Optional<Seller> sellerOpt = sellerRepository.findByEmail(email);
		if (sellerOpt.isEmpty()) {
			return "Seller not found!";
		}

		Seller seller = sellerOpt.get();
		String resetToken = UUID.randomUUID().toString();
		seller.setResetToken(resetToken);
		sellerRepository.save(seller);

		String resetLink = "https://sdpfrontend-rr9e.onrender.com/sreset-password?token=" + resetToken;

		EmailDetails mail = new EmailDetails();
		mail.setRecipient(email);
		mail.setSubject("🔐 Reset Your Password - LL-Cart");

		String htmlContent = "<h3>Hello from <span style='color:#2563EB;'>LL-Cart</span> 👋</h3>"
				+ "<p>We received a request to reset your password.</p>" + "<p><a href=\"" + resetLink + "\" "
				+ "style='padding:10px 20px; background-color:#2563EB; color:white; text-decoration:none; border-radius:5px;'>"
				+ "Click here to reset your password</a></p>"
				+ "<p>If you didn’t request this, please ignore this email.</p>"
				+ "<br><p>Regards,<br><b>LL-Cart Support Team</b></p>";

		mail.setMsgBody(htmlContent);
		emailService.sendHtmlMail(mail); // ✅ Use HTML method

		return "Reset link sent to your email";
	}

	@Override
	public String resetPassword(String token, String newPassword) {
		Seller seller = sellerRepository.findByResetToken(token);
		if (seller == null) {
			return "Invalid token!";
		}

		seller.setPassword(newPassword); // add encoder if needed
		seller.setResetToken(null);
		sellerRepository.save(seller);
		return "Password updated successfully!";
	}

	public long getTotalProductsBySeller(int sellerId) {
		Seller seller = sellerRepository.findById(sellerId).orElse(null);
		if (seller == null) {
			throw new IllegalArgumentException("Seller not found");
		}
		return productRepository.findBySeller(seller).size();
	}

	@Override
	public long getTotalOrdersBySeller(int sellerId) {
		return orderRepository.findBySellerId(sellerId).size();
	}

	@Override
	public double getTotalRevenueBySeller(int sellerId) {
		return orderRepository.findBySellerId(sellerId).stream()
				.filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
				.mapToDouble(order -> order.getAmount()).sum();
	}

	@Override
	public List<Map<String, Object>> getSalesDataBySeller(int sellerId, String period) {
		List<Map<String, Object>> salesData = new ArrayList<>();
		List<Order> orders = orderRepository.findBySellerId(sellerId);

		if ("daily".equalsIgnoreCase(period)) {
			// Last 7 days
			LocalDate today = LocalDate.now();
			for (int i = 6; i >= 0; i--) {
				LocalDate date = today.minusDays(i);
				Map<String, Object> data = new HashMap<>();
				data.put("date", date.format(DateTimeFormatter.ISO_LOCAL_DATE));

				long orderCount = orders.stream().filter(order -> order.getOrderDate().toLocalDate().equals(date))
						.count();
				double revenue = orders.stream().filter(order -> order.getOrderDate().toLocalDate().equals(date))
						.filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
						.mapToDouble(order -> order.getAmount()).sum();

				data.put("orderCount", orderCount);
				data.put("revenue", revenue);
				salesData.add(data);
			}
		} else if ("monthly".equalsIgnoreCase(period)) {
			// Last 12 months
			LocalDate today = LocalDate.now();
			for (int i = 11; i >= 0; i--) {
				LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
				String month = monthStart.format(DateTimeFormatter.ofPattern("yyyy-MM"));
				Map<String, Object> data = new HashMap<>();
				data.put("month", month);

				long orderCount = orders.stream()
						.filter(order -> order.getOrderDate().toLocalDate().getYear() == monthStart.getYear())
						.filter(order -> order.getOrderDate().toLocalDate().getMonth() == monthStart.getMonth())
						.count();
				double revenue = orders.stream()
						.filter(order -> order.getOrderDate().toLocalDate().getYear() == monthStart.getYear())
						.filter(order -> order.getOrderDate().toLocalDate().getMonth() == monthStart.getMonth())
						.filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
						.mapToDouble(order -> order.getAmount()).sum();

				data.put("orderCount", orderCount);
				data.put("revenue", revenue);
				salesData.add(data);
			}
		}

		return salesData;
	}
}
