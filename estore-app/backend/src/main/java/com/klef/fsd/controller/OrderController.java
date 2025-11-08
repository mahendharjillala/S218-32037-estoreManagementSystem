package com.klef.fsd.controller;

import com.klef.fsd.dto.OrderDTO;
import com.klef.fsd.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<OrderDTO>> getBuyerOrders(@PathVariable int buyerId) {
        try {
            List<OrderDTO> orders = orderService.getOrdersByBuyerId(buyerId);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<OrderDTO>> getSellerOrders(@PathVariable int sellerId) {
        try {
            List<OrderDTO> orders = orderService.getOrdersBySellerId(sellerId);
            return ResponseEntity.ok(orders);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}