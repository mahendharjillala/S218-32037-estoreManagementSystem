package com.klef.fsd.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import com.klef.fsd.model.Product;
import com.klef.fsd.model.Seller;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>{

	 public List<Product> findByCategory(String category);
	 
	 public List<Product> findBySeller(Seller seller);
	 
	
}
