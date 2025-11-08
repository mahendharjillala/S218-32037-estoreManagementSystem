package com.klef.fsd.service;

import com.klef.fsd.model.Seller;

import java.util.List;
import java.util.Map;

public interface SellerService {
    // Existing methods
    String sellerRegistration(Seller seller);
    Seller checkSellerLogin(String username, String password);
    List<Seller> viewPendingSellers();
    String approveSeller(int sellerId);
    String rejectSeller(int id);
    String deleteSeller(int id);
    Seller getSellerById(int sid);
    String updateSellerProfile(Seller seller);
    List<Seller> viewAllSellers();
    String generateResetToken(String email);
    String resetPassword(String token, String newPassword);

    // New methods for dashboard
    long getTotalProductsBySeller(int sellerId);
    long getTotalOrdersBySeller(int sellerId);
    double getTotalRevenueBySeller(int sellerId);
    List<Map<String, Object>> getSalesDataBySeller(int sellerId, String period);
}