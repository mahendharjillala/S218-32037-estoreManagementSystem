package com.klef.fsd.service;

import java.util.List;

import com.klef.fsd.dto.CartDTO;
import com.klef.fsd.model.Cart;

public interface CartService {

    Cart addToCart(Cart cart);

    List<CartDTO> getCartItemsByBuyerId(int buyerId);

    void removeCartItem(int cartId);

    void clearCartByBuyerId(int buyerId);

    Cart updateCartQuantity(int buyerId, int productId, int quantity);

    int getCartCountByBuyerId(int buyerId);
    
}
