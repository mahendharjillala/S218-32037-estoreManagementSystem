package com.klef.fsd.controller;

import java.sql.Blob;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import com.klef.fsd.dto.ProductDTO;
import com.klef.fsd.model.Product;
import com.klef.fsd.model.Seller;
import com.klef.fsd.service.ProductService;
import com.klef.fsd.service.SellerService;

@RestController
@CrossOrigin("*")
@RequestMapping("/product")
public class ProductController {
	@Autowired
	private ProductService productService;
	@Autowired
	private SellerService sellerservice;

	@PostMapping("/addproduct")
	public ResponseEntity<String> addProduct(@RequestParam String category, @RequestParam String name,
			@RequestParam String description, @RequestParam double cost,
			@RequestParam("productimage") MultipartFile file, @RequestParam int sid) {
		try {
			Seller seller = sellerservice.getSellerById(sid);
			byte[] bytes = file.getBytes();
			Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);
			Product p = new Product();
			p.setCategory(category);
			p.setCost(cost);
			p.setDescription(description);
			p.setImage(blob);
			p.setSeller(seller);
			p.setName(name);

			String output = productService.addProduct(p);
			return ResponseEntity.ok(output);
		} catch (Exception e) {
			return ResponseEntity.status(500).body("Error: " + e.getMessage());
		}

	}

	@PutMapping("/updateproduct")
	public ResponseEntity<String> updateProduct(@RequestParam int id, @RequestParam String category, 
	        @RequestParam String name, @RequestParam String description, @RequestParam double cost,
	        @RequestParam(value = "productimage", required = false) MultipartFile file, 
	        @RequestParam int sid) {
	    try {
	        Seller seller = sellerservice.getSellerById(sid);
	        Product p = productService.getProductById(id); // Get existing product
	        if (p == null) {
	            return ResponseEntity.status(404).body("Product not found");
	        }
	        
	        p.setCategory(category);
	        p.setCost(cost);
	        p.setDescription(description);
	        p.setName(name);
	        p.setSeller(seller);
	        
	        // Only update image if a new one is provided
	        if (file != null && !file.isEmpty()) {
	            byte[] bytes = file.getBytes();
	            Blob blob = new javax.sql.rowset.serial.SerialBlob(bytes);
	            p.setImage(blob);
	        }

	        String output = productService.updateProduct(p);
	        return ResponseEntity.ok(output);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Error: " + e.getMessage());
	    }
	}
	
	@GetMapping("viewallproducts")
	public ResponseEntity<List<ProductDTO>> viewallproducts() {
		List<Product> productList = productService.viewallProducts();
		List<ProductDTO> productDTOList = new ArrayList<>();

		for (Product p : productList) {
			ProductDTO dto = new ProductDTO();
			dto.setId(p.getId());
			dto.setCategory(p.getCategory());
			dto.setName(p.getName());
			dto.setDescription(p.getDescription());
			dto.setCost(p.getCost());
			dto.setSeller_id(p.getSeller().getId());
			productDTOList.add(dto);
		}

		return ResponseEntity.ok(productDTOList);
	}

	@GetMapping("displayproductimage")
	public ResponseEntity<byte[]> displayproductimage(@RequestParam int id) throws Exception {
		Product product = productService.viewProductById(id);
		byte[] imageBytes = null;
		imageBytes = product.getImage().getBytes(1, (int) product.getImage().length());

		return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);

	}
	@GetMapping("/getproduct/{id}")
	public ResponseEntity<ProductDTO> getProduct(@PathVariable int id) {
	    Product product = productService.getProductById(id);
	    if (product == null) {
	        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with ID " + id);
	    }

	    // Convert Product to ProductDTO
	    ProductDTO dto = new ProductDTO();
	    dto.setId(product.getId());
	    dto.setCategory(product.getCategory());
	    dto.setName(product.getName());
	    dto.setDescription(product.getDescription());
	    dto.setCost(product.getCost());
	    dto.setSeller_id(product.getSeller().getId());

	    return ResponseEntity.ok(dto);
	}




	@GetMapping("viewproductsbyseller/{sid}")
	public ResponseEntity<List<ProductDTO>> viewProductBySeller(@PathVariable int sid) {
		List<Product> products = productService.viewProductsBySeller(sid);
		List<ProductDTO> productDTOs = new ArrayList<>();

		for (Product p : products) {
			ProductDTO dto = new ProductDTO();
			dto.setId(p.getId());
			dto.setCategory(p.getCategory());
			dto.setName(p.getName());
			dto.setDescription(p.getDescription());
			dto.setCost(p.getCost());
			dto.setSeller_id(p.getSeller().getId());
			productDTOs.add(dto);
		}

		return ResponseEntity.ok(productDTOs); // ✅ No Blob, no error
	}

	@DeleteMapping("/deleteproduct/{id}")
	public ResponseEntity<String> deleteProduct(@PathVariable int id) {
	    try {
	        String result = productService.deleteProduct(id);
	        return ResponseEntity.ok(result);
	    } catch (Exception e) {
	        return ResponseEntity.status(500).body("Error: " + e.getMessage());
	    }
	}

	@GetMapping("categories")
		 public ResponseEntity<List<ProductDTO>> viewproductsByCategory(@RequestParam String category)
		 {
		     List<Product> productList = productService.viewProductsByCategory(category);
		     List<ProductDTO> productDTOList = new ArrayList<>();

		     for (Product p : productList) {
		         ProductDTO dto = new ProductDTO();
		         dto.setId(p.getId());
		         dto.setCategory(p.getCategory());
		         dto.setName(p.getName());
		         dto.setDescription(p.getDescription());
		         dto.setCost(p.getCost());
		         dto.setSeller_id(p.getSeller().getId()); 
		         productDTOList.add(dto);
		     }

		     return ResponseEntity.ok(productDTOList);
		 }
	
	
}
