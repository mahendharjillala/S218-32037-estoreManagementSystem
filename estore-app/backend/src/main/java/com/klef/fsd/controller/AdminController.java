package com.klef.fsd.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.klef.fsd.model.Admin;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Seller;
import com.klef.fsd.service.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin("*")
public class AdminController {

	@Autowired
	private AdminService service;
//	@Autowired
//	private SellerService sellerservice;

	// Existing endpoints (unchanged)
	@PostMapping("/checkadminlogin")
	public ResponseEntity<?> checkadminlogin(@RequestBody Admin admin) {
		try {
			Admin a = service.checkadminlogin(admin.getUsername(), admin.getPassword());
			if (a != null) {
				return ResponseEntity.ok(a);
			} else {
				return ResponseEntity.status(401).body("Invalid Username or Password");
			}
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
		}
	}

	@PostMapping("/addseller")
	public ResponseEntity<String> addseller(@RequestBody Seller seller) {
		try {
			String output = service.addSeller(seller);
			return ResponseEntity.ok(output);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Failed to Add Seller ... !!");
		}
	}

	@GetMapping("/viewallsellers")
	public ResponseEntity<List<Seller>> viewallsellers() {
		List<Seller> sellers = service.viewSellers();
		return ResponseEntity.ok(sellers);
	}

	@GetMapping("/viewallbuyers")
	public ResponseEntity<List<Buyer>> viewallbuyers() {
		List<Buyer> buyers = service.viewBuyers();
		return ResponseEntity.ok(buyers);
	}

//	@PostMapping("/approveseller")
//	public ResponseEntity<String> approveSeller(@RequestBody int sellerId) {
//		try {
//			String result = service.approveSeller(sellerId);
//			return ResponseEntity.ok(result);
//		} catch (Exception e) {
//			return ResponseEntity.status(500).body("Approval Failed: " + e.getMessage());
//		}
//	}
//	@PostMapping("/approveseller")
//	public ResponseEntity<String> approveSeller(@RequestBody Map<String, Integer> body) {
//	    try {
//	        int sellerId = body.get("id");
//	        String result = service.approveSeller(sellerId);
//	        return ResponseEntity.ok(result);
//	    } catch (Exception e) {
//	        return ResponseEntity.status(500).body("Approval Failed: " + e.getMessage());
//	    }
//	}
	@PostMapping("/approveseller/{id}")
	public ResponseEntity<String> approveSeller(@PathVariable("id") int sellerId) {
	    try {
	        String result = service.approveSeller(sellerId);
	        return ResponseEntity.ok(result);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Approval Failed: " + e.getMessage());
	    }
	}

	

	// New endpoints for Admin Dashboard
	@GetMapping("/sellers/count")
	public ResponseEntity<Map<?, ?>> getTotalSellers() {
		try {
			long count = service.getTotalSellers();
			return ResponseEntity.ok(Map.of("totalSellers", count));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch seller count: " + e.getMessage()));
		}
	}

	@GetMapping("/buyers/count")
	public ResponseEntity<Map<?, ?>> getTotalBuyers() {
		try {
			long count = service.getTotalBuyers();
			return ResponseEntity.ok(Map.of("totalBuyers", count));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch buyer count: " + e.getMessage()));
		}
	}

	@GetMapping("/products/count")
	public ResponseEntity<Map<?, ?>> getTotalProducts() {
		try {
			long count = service.getTotalProducts();
			return ResponseEntity.ok(Map.of("totalProducts", count));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch product count: " + e.getMessage()));
		}
	}

	@GetMapping("/orders/count")
	public ResponseEntity<Map<?, ?>> getTotalOrders() {
		try {
			long count = service.getTotalOrders();
			return ResponseEntity.ok(Map.of("totalOrders", count));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch order count: " + e.getMessage()));
		}
	}

	@GetMapping("/revenue")
	public ResponseEntity<Map<?, ?>> getTotalRevenue() {
		try {
			double revenue = service.getTotalRevenue();
			return ResponseEntity.ok(Map.of("totalRevenue", revenue));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch revenue: " + e.getMessage()));
		}
	}

	@GetMapping("/sales-data")
	public ResponseEntity<List<Map<String, Object>>> getSalesData(
			@RequestParam(value = "period", defaultValue = "daily") String period) {
		try {
			List<Map<String, Object>> salesData = service.getSalesData(period);
			return ResponseEntity.ok(salesData);
		} catch (Exception e) {
			return ResponseEntity.status(500)
					.body(List.of(Map.of("error", "Failed to fetch sales data: " + e.getMessage())));
		}
	}
}
