package com.klef.fsd.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.klef.fsd.model.Address;

@Repository
public interface AddressRepository extends JpaRepository<Address, Integer> {
	public List<Address> findByBuyerId(Integer buyerId);
	public Optional<Address> findByIdAndBuyerId(int addressId, int buyerId);
}
