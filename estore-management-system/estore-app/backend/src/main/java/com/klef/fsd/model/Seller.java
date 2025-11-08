package com.klef.fsd.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

//name,email,username,password,mobileno,nationalidno,location
@Entity
@Table(name = "seller_table")
public class Seller {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "seller_id")
	private int id;

	@Column(name = "seller_name", length = 50, nullable = false)
	private String name;

	@Column(name = "seller_email", length = 70, nullable = false, unique = true)
	private String email;

	@Column(name = "seller_username", length = 50, nullable = false, unique = true)
	private String username;

	@Column(name = "seller_pwd", length = 20, nullable = false)
	private String password;

	@Column(name = "seller_mobileno", length = 20, nullable = false)
	private String mobileno;

	@Column(name = "seller_nationalidno", length = 20, nullable = false, unique = true)
	private String nationalidno;

	@Column(name = "seller_location", length = 20, nullable = false)
	private String location;

	@Column(name = "seller_status", length = 20)
	private String status = "Pending";
	
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

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
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

	public String getNationalidno() {
		return nationalidno;
	}

	public void setNationalidno(String nationalidno) {
		this.nationalidno = nationalidno;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getResetToken() {
		return resetToken;
	}

	public void setResetToken(String resetToken) {
		this.resetToken = resetToken;
	}

}
