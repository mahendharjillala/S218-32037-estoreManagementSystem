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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.HttpStatus;

import com.klef.fsd.model.Seller;
import com.klef.fsd.service.SellerService;

@RestController
@RequestMapping("/seller")
@CrossOrigin("*")
public class SellerController {

	@Autowired
	private SellerService sellerService;

	// Existing endpoints (unchanged)
	@PostMapping("/registration")
	public ResponseEntity<?> sellerRegistration(@RequestBody Seller seller) {
		try {
			String output = sellerService.sellerRegistration(seller);
			return ResponseEntity.ok(output);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Seller registration failed.");
		}
	}

	@PostMapping("/checksellerlogin")
	public ResponseEntity<?> checkSellerLogin(@RequestBody Seller seller) {
		Seller s = sellerService.checkSellerLogin(seller.getUsername(), seller.getPassword());
		if (s != null) {
			return ResponseEntity.ok(s);
		} else {
			return ResponseEntity.status(401).body("Invalid credentials or not approved.");
		}
	}

	
  @GetMapping("/pending")
  public ResponseEntity<List<Seller>> viewPendingSellers() {
    List<Seller> list = sellerService.viewPendingSellers();
    return ResponseEntity.ok(list);
  }
//
//  @PutMapping("/approve/{id}")
//  public ResponseEntity<String> approveSeller(@PathVariable("id") int id) {
//    String result = sellerService.approveSeller(id);
//    return ResponseEntity.ok(result);
//  }

  @PutMapping("/reject/{id}")
  public ResponseEntity<String> rejectSeller(@PathVariable("id") int id) {
    String result = sellerService.rejectSeller(id);
    return ResponseEntity.ok(result);
  }

  @DeleteMapping("/delete")
  public ResponseEntity<String> deleteSeller(@RequestParam("id") int id) {
    String result = sellerService.deleteSeller(id);
    return ResponseEntity.ok(result);
  }

  @PutMapping("/updateseller")
  public ResponseEntity<String> sellerupdateprofile(@RequestBody Seller seller) {
    try {
      System.out.println(seller.toString());
      String output = sellerService.updateSellerProfile(seller);
      return ResponseEntity.ok(output);
    } catch (Exception e) {
      System.out.println(e.getMessage());
      return ResponseEntity.status(500).body("Failed to Update Seller ... !!");
    }
  }

  @GetMapping("/viewallsellers")
  public List<Seller> viewAllSellers() {

    return sellerService.viewAllSellers();

  }
	@GetMapping("/{sellerId}/products/count")
	public ResponseEntity<Map<?, ?>> getTotalProducts(@PathVariable("sellerId") int sellerId) {
		try {
			long count = sellerService.getTotalProductsBySeller(sellerId);
			return ResponseEntity.ok(Map.of("sellerId", (long) sellerId, "totalProducts", count));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch product count: " + e.getMessage()));
		}
	}

	@GetMapping("/{sellerId}/orders/count")
	public ResponseEntity<Map<?, ?>> getTotalOrders(@PathVariable("sellerId") int sellerId) {
		try {
			long count = sellerService.getTotalOrdersBySeller(sellerId);
			return ResponseEntity.ok(Map.of("sellerId", (long) sellerId, "totalOrders", count));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch order count: " + e.getMessage()));
		}
	}

	@GetMapping("/{sellerId}/revenue")
	public ResponseEntity<Map<?, ?>> getTotalRevenue(@PathVariable("sellerId") int sellerId) {
		try {
			double revenue = sellerService.getTotalRevenueBySeller(sellerId);
			return ResponseEntity.ok(Map.of("sellerId", (long) sellerId, "totalRevenue", revenue));
		} catch (Exception e) {
			return ResponseEntity.status(500).body(Map.of("error", "Failed to fetch revenue: " + e.getMessage()));
		}
	}

	@GetMapping("/{sellerId}/sales-data")
	public ResponseEntity<List<Map<String, Object>>> getSalesData(@PathVariable("sellerId") int sellerId,
			@RequestParam(value = "period", defaultValue = "daily") String period) {
		try {
			List<Map<String, Object>> salesData = sellerService.getSalesDataBySeller(sellerId, period);
			return ResponseEntity.ok(salesData);
		} catch (Exception e) {
			return ResponseEntity.status(500)
					.body(List.of(Map.of("error", "Failed to fetch sales data: " + e.getMessage())));
		}
	}
@PostMapping("/sforgot-password")
  public ResponseEntity<String> forgotPassword(@RequestParam String email) {
    String result = sellerService.generateResetToken(email);
    if (result.equals("Seller not found!")) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }
    return ResponseEntity.ok(result);
  }

  @PostMapping("/sreset-password")
  public ResponseEntity<String> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
    String result = sellerService.resetPassword(token, newPassword);
    if (result.equals("Invalid token!")) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }
    return ResponseEntity.ok(result);
  }
}
