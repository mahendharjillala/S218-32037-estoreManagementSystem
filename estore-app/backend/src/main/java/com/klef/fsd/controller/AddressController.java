package com.klef.fsd.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.fsd.model.Address;
import com.klef.fsd.service.AddressService;

@RestController
@RequestMapping("address")
@CrossOrigin(origins = "*")
public class AddressController {

    @Autowired
    private AddressService addressService;

    @PostMapping("/add/{buyerId}")
    public Address addAddress(@RequestBody Address address, @PathVariable int  buyerId) {
        return addressService.addAddress(address, buyerId);
    }

    @GetMapping("/buyer/{buyerId}")
    public List<Address> getBuyerAddresses(@PathVariable int  buyerId) {
        return addressService.getAddressesByBuyer(buyerId);
    }
    
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteAddress(@PathVariable int id) {
        try {
            addressService.deleteAddress(id);
            return ResponseEntity.ok("Address deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
