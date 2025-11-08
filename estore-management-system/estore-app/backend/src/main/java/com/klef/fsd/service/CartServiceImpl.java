package com.klef.fsd.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.klef.fsd.dto.CartDTO;
import com.klef.fsd.dto.ProductDTO;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Cart;
import com.klef.fsd.model.Product;
import com.klef.fsd.repository.BuyerRepository;
import com.klef.fsd.repository.CartRepository;
import com.klef.fsd.repository.ProductRepository;

@Service
@Transactional
public class CartServiceImpl implements CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Override
    public Cart addToCart(Cart cart) {
        if (cart == null || cart.getProduct() == null || cart.getBuyer() == null) {
            throw new IllegalArgumentException("Cart, product, or buyer cannot be null");
        }

        Optional<Product> productOpt = productRepository.findById(cart.getProduct().getId());
        if (!productOpt.isPresent()) {
            throw new IllegalArgumentException("Product does not exist");
        }

        Optional<Buyer> buyerOpt = buyerRepository.findById(cart.getBuyer().getId());
        if (!buyerOpt.isPresent()) {
            throw new IllegalArgumentException("Buyer does not exist");
        }

        // Check if the product is already in the cart for this buyer
        Cart existingCart = cartRepository.findByBuyerIdAndProductId(cart.getBuyer().getId(), cart.getProduct().getId());
        if (existingCart != null) {
            throw new IllegalArgumentException("Product already in cart");
        }

        // Check cart limit (e.g., max 10 products)
        List<Cart> buyerCartItems = cartRepository.findByBuyer(buyerOpt.get());
        if (buyerCartItems.size() >= 10) {
            throw new IllegalArgumentException("Cart limit exceeded");
        }

        cart.setBuyer(buyerOpt.get());
        cart.setProduct(productOpt.get());
        return cartRepository.save(cart);
    }

    @Override
    public List<CartDTO> getCartItemsByBuyerId(int buyerId) {
        Optional<Buyer> buyerOpt = buyerRepository.findById(buyerId);
        if (!buyerOpt.isPresent()) {
            return null;
        }

        List<Cart> cartItems = cartRepository.findByBuyer(buyerOpt.get());
        List<CartDTO> cartDTOs = new ArrayList<>();

        for (Cart cart : cartItems) {
            CartDTO cartDTO = new CartDTO();
            cartDTO.setId(cart.getCid());
            cartDTO.setQuantity(cart.getQuantity());

            ProductDTO pdto = new ProductDTO();
            pdto.setId(cart.getProduct().getId());
            pdto.setName(cart.getProduct().getName());
            pdto.setCategory(cart.getProduct().getCategory());
            pdto.setDescription(cart.getProduct().getDescription());
            pdto.setCost(cart.getProduct().getCost());
            pdto.setSeller_id(cart.getProduct().getSeller() != null ? cart.getProduct().getSeller().getId() : 0);

            cartDTO.setProduct(pdto);
            cartDTOs.add(cartDTO);
        }

        return cartDTOs;
    }

    @Override
    public void removeCartItem(int cartId) {
        Optional<Cart> cartOpt = cartRepository.findById(cartId);
        if (!cartOpt.isPresent()) {
            throw new IllegalArgumentException("Cart item does not exist");
        }
        cartRepository.deleteById(cartId);
    }

    @Override
    public void clearCartByBuyerId(int buyerId) {
        Optional<Buyer> buyerOpt = buyerRepository.findById(buyerId);
        if (!buyerOpt.isPresent()) {
            throw new IllegalArgumentException("Buyer does not exist");
        }
        cartRepository.deleteByBuyerId(buyerId);
    }

    @Override
    public Cart updateCartQuantity(int buyerId, int productId, int quantity) {
        if (quantity < 1 || quantity > 10) {
            throw new IllegalArgumentException("Quantity must be between 1 and 10");
        }

        Optional<Buyer> buyerOpt = buyerRepository.findById(buyerId);
        if (!buyerOpt.isPresent()) {
            throw new IllegalArgumentException("Buyer does not exist");
        }

        Optional<Product> productOpt = productRepository.findById(productId);
        if (!productOpt.isPresent()) {
            throw new IllegalArgumentException("Product does not exist");
        }

        Cart cart = cartRepository.findByBuyerIdAndProductId(buyerId, productId);
        if (cart == null) {
            throw new IllegalArgumentException("Cart item does not exist for this buyer and product");
        }

        cart.setQuantity(quantity);
        return cartRepository.save(cart);
    }

    @Override
    public int getCartCountByBuyerId(int buyerId) {
        Optional<Buyer> buyerOpt = buyerRepository.findById(buyerId);
        if (!buyerOpt.isPresent()) {
            throw new IllegalArgumentException("Buyer does not exist");
        }
        return cartRepository.countByBuyerId(buyerId);
    }
}