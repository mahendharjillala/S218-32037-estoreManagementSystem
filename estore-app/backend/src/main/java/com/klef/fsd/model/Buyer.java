package com.klef.fsd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "buyer_table")

public class Buyer {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "buyer_id")
	private int id;
	@Column(name = "buyer_name", length = 50, nullable = false)
	private String name;
	@Column(name = "buyer_email", length = 30, nullable = false, unique = true)
	private String email;
	@Column(name = "buyer_pwd", length = 20, nullable = false)
	private String password;
	@Column(name = "buyer_mobileno", length = 20, nullable = false)
	private String mobileno;
	@Column(name = "reset_token", length = 255, nullable = true)
	private String resetToken = null;
	
	

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getMobileno() {
		return mobileno;
	}

	public void setMobileno(String mobileno) {
		this.mobileno = mobileno;
	}

	public String getResetToken() {
		return resetToken;
	}

	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}

	
	

}
