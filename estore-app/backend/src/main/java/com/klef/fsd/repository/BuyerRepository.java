package com.klef.fsd.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.klef.fsd.model.Buyer;


public interface BuyerRepository extends JpaRepository<Buyer, Integer> {
	public Buyer findByEmailAndPassword(String email, String password);

	public Optional<Buyer> findByEmail(String email);

	public Buyer findByResetToken(String resetToken);

	public Optional<Buyer> findById(Integer buyerId);

}
