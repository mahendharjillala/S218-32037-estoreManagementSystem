package com.klef.fsd.service;

import com.klef.fsd.dto.OrderDTO;
import com.klef.fsd.model.Order;

import java.util.List;

public interface OrderService {
    Order createOrder(Order order);
    List<OrderDTO> getOrdersByBuyerId(int buyerId);
    List<OrderDTO> getOrdersBySellerId(int sellerId);
}