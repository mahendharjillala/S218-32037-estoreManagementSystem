package com.klef.fsd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.klef.fsd.dto.CartDTO;
import com.klef.fsd.dto.ProductDTO;
import com.klef.fsd.model.Cart;
import com.klef.fsd.service.CartService;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(@RequestBody Cart cart) {
        try {
            Cart savedCart = cartService.addToCart(cart);
            if (savedCart == null) {
                return ResponseEntity.badRequest().body(null);
            }

            // Map Cart to CartDTO
            CartDTO cartDTO = new CartDTO();
            cartDTO.setId(savedCart.getCid());
            cartDTO.setQuantity(savedCart.getQuantity());

            if (savedCart.getProduct() != null) {
                ProductDTO pdto = new ProductDTO();
                pdto.setId(savedCart.getProduct().getId());
                pdto.setName(savedCart.getProduct().getName());
                pdto.setCategory(savedCart.getProduct().getCategory());
                pdto.setDescription(savedCart.getProduct().getDescription());
                pdto.setCost(savedCart.getProduct().getCost());
                pdto.setSeller_id(savedCart.getProduct().getSeller() != null ? savedCart.getProduct().getSeller().getId() : 0);
                cartDTO.setProduct(pdto);
            }

            return ResponseEntity.ok(cartDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/buyer/{buyerId}")
    public ResponseEntity<List<CartDTO>> getCartItems(@PathVariable int buyerId) {
        List<CartDTO> cartItems = cartService.getCartItemsByBuyerId(buyerId);
        if (cartItems == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(cartItems);
    }

    @GetMapping("/count/{buyerId}")
    public ResponseEntity<Integer> getCartCount(@PathVariable int buyerId) {
        try {
            int count = cartService.getCartCountByBuyerId(buyerId);
            return ResponseEntity.ok(count);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(0);
        }
    }

    @DeleteMapping("/remove/{cartId}")
    public ResponseEntity<String> removeCartItem(@PathVariable int cartId) {
        try {
            cartService.removeCartItem(cartId);
            return ResponseEntity.ok("Cart item removed successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/clear/{buyerId}")
    public ResponseEntity<String> clearCart(@PathVariable int buyerId) {
        try {
            cartService.clearCartByBuyerId(buyerId);
            return ResponseEntity.ok("Cart cleared successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateCartQuantity(
            @RequestParam int buyerId,
            @RequestParam int productId,
            @RequestParam int quantity) {
        try {
            Cart updatedCart = cartService.updateCartQuantity(buyerId, productId, quantity);
            if (updatedCart == null) {
                return ResponseEntity.badRequest().body(null);
            }

            // Map Cart to CartDTO
            CartDTO cartDTO = new CartDTO();
            cartDTO.setId(updatedCart.getCid());
            cartDTO.setQuantity(updatedCart.getQuantity());

            if (updatedCart.getProduct() != null) {
                ProductDTO pdto = new ProductDTO();
                pdto.setId(updatedCart.getProduct().getId());
                pdto.setName(updatedCart.getProduct().getName());
                pdto.setCategory(updatedCart.getProduct().getCategory());
                pdto.setDescription(updatedCart.getProduct().getDescription());
                pdto.setCost(updatedCart.getProduct().getCost());
                pdto.setSeller_id(updatedCart.getProduct().getSeller() != null ? updatedCart.getProduct().getSeller().getId() : 0);
                cartDTO.setProduct(pdto);
            }

            return ResponseEntity.ok(cartDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}