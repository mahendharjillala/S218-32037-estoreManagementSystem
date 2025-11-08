package com.klef.fsd.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.fsd.model.Seller;

public interface SellerRepository extends JpaRepository<Seller, Integer> {
    Seller findByUsernameAndPassword(String username, String password);
    List<Seller> findByStatus(String status);
    
    Optional<Seller> findByEmail(String email);
    Seller findByResetToken(String resetToken);

}

