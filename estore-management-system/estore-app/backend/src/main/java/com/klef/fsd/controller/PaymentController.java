package com.klef.fsd.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.fsd.model.Address;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Order;
import com.klef.fsd.model.Product;
import com.klef.fsd.repository.AddressRepository;
import com.klef.fsd.repository.BuyerRepository;
import com.klef.fsd.repository.OrderRepository;
import com.klef.fsd.repository.ProductRepository;
import com.klef.fsd.service.CartService;
import com.klef.fsd.service.OrderService;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;

@RestController
@RequestMapping("/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    @Autowired
    private CartService cartService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${razorpay.key.id:}")
    private String razorpayKeyId;

    @Value("${razorpay.secret.key:}")
    private String razorpaySecretKey;

    @PostMapping("/create-order")
    public ResponseEntity<Map<String, Object>> createOrder(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Integer buyerId = parseId(request.get("buyerId"), "Buyer ID");
            Integer addressId = parseId(request.get("addressId"), "Address ID");

            logger.info("Creating order for buyerId={}, addressId={}", buyerId, addressId);

            // Validate buyer existence
            Buyer buyer = buyerRepository.findById(buyerId)
                    .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + buyerId));
            logger.info("Buyer validated: ID={}", buyerId);

            // Validate address existence
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + addressId));
            logger.info("Address validated: ID={}", addressId);

            // Fetch cart items
            List<com.klef.fsd.dto.CartDTO> cartItems = cartService.getCartItemsByBuyerId(buyerId);
            if (cartItems == null || cartItems.isEmpty()) {
                response.put("success", false);
                response.put("message", "Cart is empty");
                return ResponseEntity.badRequest().body(response);
            }
            logger.info("Cart items fetched: Count={}", cartItems.size());

            // Validate cart items
            for (com.klef.fsd.dto.CartDTO cartItem : cartItems) {
                if (cartItem == null || cartItem.getProduct() == null || cartItem.getProduct().getId() == 0) {
                    throw new IllegalStateException("Invalid cart item: Product is missing or invalid");
                }
            }

            // Calculate total amount
            double totalAmount = cartItems.stream()
                    .mapToDouble(item -> {
                        if (item != null && item.getProduct() != null) {
                            return item.getProduct().getCost() * item.getQuantity();
                        }
                        return 0.0;
                    })
                    .sum();

            if (totalAmount <= 0) {
                response.put("success", false);
                response.put("message", "Total amount must be greater than zero");
                return ResponseEntity.badRequest().body(response);
            }
            logger.info("Total amount calculated: {}", totalAmount);

            // Initialize Razorpay client
            if (razorpayKeyId.isEmpty() || razorpaySecretKey.isEmpty()) {
                throw new IllegalStateException("Razorpay API keys are not configured properly. Check application.properties.");
            }

            RazorpayClient razorpayClient = new RazorpayClient(razorpayKeyId, razorpaySecretKey);
            logger.info("Razorpay client initialized successfully");

            // Create Razorpay order
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", (int) (totalAmount * 100)); // Amount in paise
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "order_rcptid_" + buyerId);

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            logger.info("Razorpay order created: OrderId={}", razorpayOrder.get("id").toString());

            // Prepare response
            response.put("success", true);
            response.put("orderId", razorpayOrder.get("id").toString());
            response.put("amount", totalAmount);
            response.put("currency", "INR");
            response.put("key", razorpayKeyId);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Validation error in createOrder: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (RazorpayException e) {
            logger.error("Razorpay error in createOrder: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Error creating Razorpay order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        } catch (Exception e) {
            logger.error("Unexpected error in createOrder: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @PostMapping("/verify-payment")
    @Transactional
    public ResponseEntity<Map<String, Object>> verifyPayment(@RequestBody Map<String, Object> paymentData) {
        Map<String, Object> response = new HashMap<>();
        try {
            String razorpayOrderId = (String) paymentData.get("razorpay_order_id");
            String paymentId = (String) paymentData.get("razorpay_payment_id");
            String signature = (String) paymentData.get("razorpay_signature");
            Integer buyerId = parseId(paymentData.get("buyerId"), "Buyer ID");
            Integer addressId = parseId(paymentData.get("addressId"), "Address ID");

            if (razorpayOrderId == null || paymentId == null || signature == null) {
                response.put("success", false);
                response.put("message", "Missing required payment details: razorpay_order_id, razorpay_payment_id, and razorpay_signature are required");
                return ResponseEntity.badRequest().body(response);
            }

            logger.info("Verifying payment: orderId={}, paymentId={}, buyerId={}, addressId={}", razorpayOrderId, paymentId, buyerId, addressId);

            // Check for duplicate payment (idempotency)
            Optional<Order> existingOrder = orderRepository.findByRazorpayPaymentId(paymentId);
            if (existingOrder.isPresent()) {
                logger.info("Duplicate payment detected: paymentId={}", paymentId);
                response.put("success", true);
                response.put("message", "Payment already processed for this payment ID");
                return ResponseEntity.ok(response);
            }

            // Verify the payment signature
            String payload = razorpayOrderId + "|" + paymentId;
            boolean isValidSignature = Utils.verifySignature(payload, signature, razorpaySecretKey);
            if (!isValidSignature) {
                logger.error("Payment signature verification failed: orderId={}, paymentId={}", razorpayOrderId, paymentId);
                response.put("success", false);
                response.put("message", "Payment signature verification failed");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
            logger.info("Payment signature verified successfully");

            // Fetch buyer and address
            Buyer buyer = buyerRepository.findById(buyerId)
                    .orElseThrow(() -> new IllegalArgumentException("Buyer not found with ID: " + buyerId));
            Address address = addressRepository.findById(addressId)
                    .orElseThrow(() -> new IllegalArgumentException("Address not found with ID: " + addressId));
            logger.info("Buyer and Address validated: BuyerId={}, AddressId={}", buyerId, addressId);

            // Fetch cart items
            List<com.klef.fsd.dto.CartDTO> cartItems = cartService.getCartItemsByBuyerId(buyerId);
            if (cartItems == null || cartItems.isEmpty()) {
                response.put("success", false);
                response.put("message", "Cart is empty");
                return ResponseEntity.badRequest().body(response);
            }
            logger.info("Cart items fetched for verification: Count={}", cartItems.size());

            // Validate cart items
            for (com.klef.fsd.dto.CartDTO cartItem : cartItems) {
                if (cartItem == null || cartItem.getProduct() == null || cartItem.getProduct().getId() == 0) {
                    throw new IllegalStateException("Invalid cart item: Product is missing or invalid");
                }
            }

            // Create orders for each cart item
            for (com.klef.fsd.dto.CartDTO cartItem : cartItems) {
                Product product = productRepository.findById(cartItem.getProduct().getId())
                        .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + cartItem.getProduct().getId()));

                Order order = new Order();
                order.setBuyer(buyer);
                order.setSeller(product.getSeller());
                order.setProduct(product);
                order.setQuantity(cartItem.getQuantity());
                order.setAmount(product.getCost() * cartItem.getQuantity());
                order.setStatus("PAID");
                order.setOrderDate(LocalDateTime.now());
                order.setAddress(address);
                order.setRazorpayOrderId(razorpayOrderId);
                order.setRazorpayPaymentId(paymentId);

                orderService.createOrder(order);
                logger.info("Order created: ProductId={}, Quantity={}", product.getId(), cartItem.getQuantity());
            }

            // Clear the cart
            cartService.clearCartByBuyerId(buyerId);
            logger.info("Cart cleared for BuyerId={}", buyerId);

            response.put("success", true);
            response.put("message", "Payment verified and order created successfully");
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException | IllegalStateException e) {
            logger.error("Validation error in verifyPayment: {}", e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        } catch (Exception e) {
            logger.error("Unexpected error in verifyPayment: {}", e.getMessage(), e);
            response.put("success", false);
            response.put("message", "Error verifying payment: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Helper method to parse IDs from request
    private Integer parseId(Object idObj, String fieldName) {
        if (idObj == null) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
        try {
            if (idObj instanceof Integer) {
                return (Integer) idObj;
            } else if (idObj instanceof String) {
                return Integer.parseInt((String) idObj);
            } else {
                throw new IllegalArgumentException("Invalid " + fieldName + " format");
            }
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid " + fieldName + " format: " + e.getMessage());
        }
    }
}