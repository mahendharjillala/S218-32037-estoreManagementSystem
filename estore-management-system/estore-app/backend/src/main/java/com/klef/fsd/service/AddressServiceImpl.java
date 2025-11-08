package com.klef.fsd.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.klef.fsd.model.Address;
import com.klef.fsd.model.Buyer;
import com.klef.fsd.repository.AddressRepository;
import com.klef.fsd.repository.BuyerRepository;


	@Service
	public class AddressServiceImpl implements AddressService {

	    @Autowired
	    private AddressRepository addressRepository;

	    @Autowired
	    private BuyerRepository buyerRepository;

	    @Override
	    public Address addAddress(Address address, Integer buyerId) {
	        Buyer buyer = buyerRepository.findById(buyerId)
	                .orElseThrow(() -> new RuntimeException("Buyer not found with id: " + buyerId));
	        address.setBuyer(buyer);
	        return addressRepository.save(address);
    }

	    @Override
	    public List<Address> getAddressesByBuyer(Integer buyerId) {
	        return addressRepository.findByBuyerId(buyerId);
	    }
	
	    public void deleteAddress(int addressId) {
	        if (addressRepository.existsById(addressId)) {
	            addressRepository.deleteById(addressId);
	        } else {
	            throw new RuntimeException("Address not found with ID: " + addressId);
	        }
	    }

}
