package com.klef.fsd.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.fsd.model.Admin;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Order;
import com.klef.fsd.model.Seller;
import com.klef.fsd.repository.AdminRepository;
import com.klef.fsd.repository.BuyerRepository;
import com.klef.fsd.repository.OrderRepository;
import com.klef.fsd.repository.ProductRepository;
import com.klef.fsd.repository.SellerRepository;

@Service
public class AdminServiceImpl implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;
    
    @Override
    public Admin checkadminlogin(String username, String password) {
        return adminRepository.findByUsernameAndPassword(username, password);
    }

    @Override
    public String addSeller(Seller seller) {
        sellerRepository.save(seller);
        return "Seller Added Successfully";
    }

    @Override
    public List<Seller> viewSellers() {
        return sellerRepository.findAll();
    }

    @Override
    public List<Buyer> viewBuyers() {
        return buyerRepository.findAll();
    }

    @Override
    public String deleteSeller(int id) {
        Optional<Seller> seller = sellerRepository.findById(id);
        if (seller.isPresent()) {
            sellerRepository.deleteById(id);
            return "Seller Deleted Successfully";
        } else {
            return "Seller Id not Found";
        }
    }

    @Override
    public String deleteBuyer(int id) {
        Optional<Buyer> buyer = buyerRepository.findById(id);
        if (buyer.isPresent()) {
            buyerRepository.deleteById(id);
            return "Buyer Deleted Successfully";
        } else {
            return "Buyer Id not Found";
        }
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
            return "Seller Approved Successfully";
        } else {
            return "Seller Not Found";
        }
    }

    // Dashboard methods
    @Override
    public long getTotalSellers() {
        return sellerRepository.count();
    }

    @Override
    public long getTotalBuyers() {
        return buyerRepository.count();
    }

    @Override
    public long getTotalProducts() {
        return productRepository.count();
    }

    @Override
    public long getTotalOrders() {
        return orderRepository.count();
    }

    @Override
    public double getTotalRevenue() {
        return orderRepository.findAll()
                .stream()
                .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
                .mapToDouble(order -> order.getAmount())
                .sum();
    }

    @Override
    public List<Map<String, Object>> getSalesData(String period) {
        List<Map<String, Object>> salesData = new ArrayList<>();
        LocalDate today = LocalDate.now();
        
        try {
            if ("daily".equalsIgnoreCase(period)) {
                // Last 7 days
                LocalDateTime startDate = today.minusDays(6).atStartOfDay();
                List<Object[]> results = orderRepository.getAdminDailySalesData(startDate);
                
                // Create a map for each day in the last 7 days
                for (int i = 6; i >= 0; i--) {
                    LocalDate date = today.minusDays(i);
                    String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
                    
                    Map<String, Object> dayData = new HashMap<>();
                    dayData.put("date", dateStr);
                    dayData.put("orderCount", 0L);
                    dayData.put("revenue", 0.0);
                    
                    // Find matching result if exists
                    for (Object[] result : results) {
                        String resultDate = (String) result[0];
                        if (resultDate.equals(dateStr)) {
                            dayData.put("orderCount", result[1]);
                            dayData.put("revenue", result[2]);
                            break;
                        }
                    }
                    
                    salesData.add(dayData);
                }
            } else if ("monthly".equalsIgnoreCase(period)) {
                // Last 12 months
                LocalDateTime startDate = today.minusMonths(11).withDayOfMonth(1).atStartOfDay();
                List<Object[]> results = orderRepository.getAdminMonthlySalesData(startDate);
                
                // Create a map for each month in the last 12 months
                for (int i = 11; i >= 0; i--) {
                    LocalDate monthDate = today.minusMonths(i).withDayOfMonth(1);
                    String monthStr = monthDate.format(DateTimeFormatter.ofPattern("yyyy-MM"));
                    
                    Map<String, Object> monthData = new HashMap<>();
                    monthData.put("month", monthStr);
                    monthData.put("orderCount", 0L);
                    monthData.put("revenue", 0.0);
                    
                    // Find matching result if exists
                    for (Object[] result : results) {
                        String resultMonth = (String) result[0];
                        if (resultMonth.equals(monthStr)) {
                            monthData.put("orderCount", result[1]);
                            monthData.put("revenue", result[2]);
                            break;
                        }
                    }
                    
                    salesData.add(monthData);
                }
            }
        } catch (Exception e) {
            // Fallback to manual calculation if the database query fails
            List<Order> orders = orderRepository.findAll();
            
            if ("daily".equalsIgnoreCase(period)) {
                // Last 7 days
                for (int i = 6; i >= 0; i--) {
                    LocalDate date = today.minusDays(i);
                    String dateStr = date.format(DateTimeFormatter.ISO_LOCAL_DATE);
                    
                    Map<String, Object> data = new HashMap<>();
                    data.put("date", dateStr);

                    long orderCount = orders.stream()
                            .filter(order -> order.getOrderDate() != null && 
                                    order.getOrderDate().toLocalDate().equals(date))
                            .count();
                    double revenue = orders.stream()
                            .filter(order -> order.getOrderDate() != null && 
                                    order.getOrderDate().toLocalDate().equals(date))
                            .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
                            .mapToDouble(order -> order.getAmount())
                            .sum();

                    data.put("orderCount", orderCount);
                    data.put("revenue", revenue);
                    salesData.add(data);
                }
            } else if ("monthly".equalsIgnoreCase(period)) {
                // Last 12 months
                for (int i = 11; i >= 0; i--) {
                    LocalDate monthStart = today.minusMonths(i).withDayOfMonth(1);
                    String month = monthStart.format(DateTimeFormatter.ofPattern("yyyy-MM"));
                    Map<String, Object> data = new HashMap<>();
                    data.put("month", month);

                    long orderCount = orders.stream()
                            .filter(order -> order.getOrderDate() != null && 
                                    order.getOrderDate().toLocalDate().getYear() == monthStart.getYear() &&
                                    order.getOrderDate().toLocalDate().getMonth() == monthStart.getMonth())
                            .count();
                    double revenue = orders.stream()
                            .filter(order -> order.getOrderDate() != null && 
                                    order.getOrderDate().toLocalDate().getYear() == monthStart.getYear() &&
                                    order.getOrderDate().toLocalDate().getMonth() == monthStart.getMonth())
                            .filter(order -> "Completed".equalsIgnoreCase(order.getStatus()))
                            .mapToDouble(order -> order.getAmount())
                            .sum();

                    data.put("orderCount", orderCount);
                    data.put("revenue", revenue);
                    salesData.add(data);
                }
            }
        }

        return salesData;
    }
}