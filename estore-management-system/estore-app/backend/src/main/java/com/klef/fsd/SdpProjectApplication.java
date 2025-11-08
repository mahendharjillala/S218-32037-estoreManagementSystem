package com.klef.fsd;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@ComponentScan(basePackages = "com.klef.fsd")
@SpringBootApplication
public class SdpProjectApplication {

	public static void main(String[] args) {
		SpringApplication.run(SdpProjectApplication.class, args);
		System.out.println("LL-CART Backend is Running Succesfully ... !!");
	}

}
