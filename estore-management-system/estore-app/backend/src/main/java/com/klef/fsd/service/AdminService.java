
package com.klef.fsd.service;

import java.util.List;
import java.util.Map;

import com.klef.fsd.model.Admin;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Seller;

public interface AdminService 
{
  public Admin checkadminlogin(String username,String password);
  
  public String addSeller(Seller seller);
  
  public List<Seller> viewSellers();
  
  public List<Buyer> viewBuyers();
  
  public String deleteSeller(int id);
  
  public String deleteBuyer(int id);
  
  public List<Seller> viewPendingSellers();
  public String approveSeller(int sellerId);

  long getTotalSellers();
  long getTotalBuyers();
  long getTotalProducts();
  long getTotalOrders();
  double getTotalRevenue();
  List<Map<String, Object>> getSalesData(String period);
  
  
}
