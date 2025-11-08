package com.klef.fsd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.klef.fsd.model.Buyer;
import com.klef.fsd.model.Cart;

@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {

    List<Cart> findByBuyer(Buyer buyer);

    @Query("SELECT c FROM Cart c WHERE c.buyer.id = ?1 AND c.product.id = ?2")
    Cart findByBuyerIdAndProductId(int buyerId, int productId);

    @Modifying
    @Query("DELETE FROM Cart c WHERE c.buyer.id = ?1")
    void deleteByBuyerId(int buyerId);

    @Query("SELECT COUNT(c) FROM Cart c WHERE c.buyer.id = ?1")
    int countByBuyerId(int buyerId);
}