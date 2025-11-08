package com.klef.fsd.service;

import com.klef.fsd.dto.OrderDTO;
import com.klef.fsd.dto.ProductDTO;
import com.klef.fsd.model.Address;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Order;
import com.klef.fsd.model.Product;
import com.klef.fsd.repository.AddressRepository;
import com.klef.fsd.repository.BuyerRepository;
import com.klef.fsd.repository.OrderRepository;
import com.klef.fsd.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class OrderServiceImpl implements OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Override
    public Order createOrder(Order order) {
        if (order == null || order.getBuyer() == null || order.getProduct() == null || order.getSeller() == null) {
            throw new IllegalArgumentException("Order, buyer, product, or seller cannot be null");
        }

        Optional<Buyer> buyerOpt = buyerRepository.findById(order.getBuyer().getId());
        if (!buyerOpt.isPresent()) {
            throw new IllegalArgumentException("Buyer does not exist");
        }

        Optional<Product> productOpt = productRepository.findById(order.getProduct().getId());
        if (!productOpt.isPresent()) {
            throw new IllegalArgumentException("Product does not exist");
        }

        Optional<Address> addressOpt = addressRepository.findById(order.getAddress().getId());
        if (!addressOpt.isPresent()) {
            throw new IllegalArgumentException("Address does not exist");
        }

        return orderRepository.save(order);
    }

    @Override
    public List<OrderDTO> getOrdersByBuyerId(int buyerId) {
        Optional<Buyer> buyerOpt = buyerRepository.findById(buyerId);
        if (!buyerOpt.isPresent()) {
            throw new IllegalArgumentException("Buyer does not exist");
        }

        List<Order> orders = orderRepository.findByBuyerId(buyerId);
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setId(order.getId());
            orderDTO.setQuantity(order.getQuantity());
            orderDTO.setAmount(order.getAmount());
            orderDTO.setStatus(order.getStatus());
            orderDTO.setOrderDate(order.getOrderDate());
            orderDTO.setAddress(order.getAddress());

            ProductDTO productDTO = new ProductDTO();
            productDTO.setId(order.getProduct().getId());
            productDTO.setName(order.getProduct().getName());
            productDTO.setCategory(order.getProduct().getCategory());
            productDTO.setDescription(order.getProduct().getDescription());
            productDTO.setCost(order.getProduct().getCost());
            productDTO.setSeller_id(order.getSeller().getId());

            orderDTO.setProduct(productDTO);
            orderDTOs.add(orderDTO);
        }

        return orderDTOs;
    }

    @Override
    public List<OrderDTO> getOrdersBySellerId(int sellerId) {
        List<Order> orders = orderRepository.findBySellerId(sellerId);
        List<OrderDTO> orderDTOs = new ArrayList<>();

        for (Order order : orders) {
            OrderDTO orderDTO = new OrderDTO();
            orderDTO.setId(order.getId());
            orderDTO.setQuantity(order.getQuantity());
            orderDTO.setAmount(order.getAmount());
            orderDTO.setStatus(order.getStatus());
            orderDTO.setOrderDate(order.getOrderDate());
            orderDTO.setBuyerName(order.getBuyer().getName());
            orderDTO.setBuyerEmail(order.getBuyer().getEmail());
            orderDTO.setAddress(order.getAddress());

            ProductDTO productDTO = new ProductDTO();
            productDTO.setId(order.getProduct().getId());
            productDTO.setName(order.getProduct().getName());
            productDTO.setCategory(order.getProduct().getCategory());
            productDTO.setDescription(order.getProduct().getDescription());
            productDTO.setCost(order.getProduct().getCost());
            productDTO.setSeller_id(order.getSeller().getId());

            orderDTO.setProduct(productDTO);
            orderDTOs.add(orderDTO);
        }

        return orderDTOs;
    }
}