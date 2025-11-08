package com.klef.fsd.service;

import java.util.List;

import com.klef.fsd.model.Address;

public interface AddressService {
	Address addAddress(Address address, Integer buyerId);
	 void deleteAddress(int addressId);
	List<Address> getAddressesByBuyer(Integer buyerId);
}