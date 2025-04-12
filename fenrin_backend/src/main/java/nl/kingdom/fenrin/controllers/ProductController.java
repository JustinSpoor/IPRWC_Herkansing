package nl.kingdom.fenrin.controllers;

import nl.kingdom.fenrin.dto.NewProductDTO;
import nl.kingdom.fenrin.models.Product;
import nl.kingdom.fenrin.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService productService;



    @GetMapping("/productlist")
    private ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(this.productService.getProducts());
    }

    @PostMapping("/product")
    private ResponseEntity<?> saveProduct (@RequestPart("product") NewProductDTO product, @RequestParam("image")MultipartFile image) {
        Optional<Product> checkIfProductExists = this.productService.getProductByName(product.getName());

        if(checkIfProductExists.isEmpty()) {
            try{
                String imagePath = this.productService.saveProductImage(image);

                Product newProduct = this.productService.formatNewProduct(product, imagePath);

                return ResponseEntity.ok(this.productService.saveProduct(newProduct));
            } catch (IOException e) {
                return ResponseEntity.status(500).body("Failed to Save the image");
            }

        } else {
            return ResponseEntity.status(409).body("Product with name " + product.getName() +  " already exists");
        }




    }

    @PatchMapping("/build")
    private ResponseEntity<?> updateProduct(@RequestBody Product product) {
        Optional<Product> toBeUpdatedProduct = this.productService.getProductById(product.getId());
        Optional<Product> checkIfNameIsAlreadyUsed = this.productService.getProductByName(product.getName());

        if(toBeUpdatedProduct.isPresent()) {
            if(checkIfNameIsAlreadyUsed.isEmpty()) {
                toBeUpdatedProduct.get().setName(product.getName());
                toBeUpdatedProduct.get().setDescription(product.getDescription());
                toBeUpdatedProduct.get().setCategory(product.getCategory());
                toBeUpdatedProduct.get().setPrice(product.getPrice());
                toBeUpdatedProduct.get().setStock(product.getStock());


                return ResponseEntity.ok(this.productService.updateProduct(toBeUpdatedProduct.get()));
            } else {
                if(checkIfNameIsAlreadyUsed.get().getId() == toBeUpdatedProduct.get().getId()) {
                    toBeUpdatedProduct.get().setName(product.getName());
                    toBeUpdatedProduct.get().setDescription(product.getDescription());
                    toBeUpdatedProduct.get().setCategory(product.getCategory());
                    toBeUpdatedProduct.get().setPrice(product.getPrice());
                    toBeUpdatedProduct.get().setStock(product.getStock());

                    return ResponseEntity.ok(this.productService.updateProduct(toBeUpdatedProduct.get()));
                } else {
                    return ResponseEntity.status(409).body("A Product with the name " + product.getName() + " already exists.");
                }
            }
        } else {
            return  ResponseEntity.status(404).body("Could not find product with id " + product.getId());
        }
    }

    @DeleteMapping("/product/{id}")
    private ResponseEntity<?> deleteProduct(@PathVariable UUID id) {
        Optional<Product> toBeDeletedProduct = this.productService.getProductById(id);

        if(toBeDeletedProduct.isPresent()) {
            this.productService.deleteProduct(toBeDeletedProduct.get());
            return ResponseEntity.status(204).body(null);
        } else {
            return ResponseEntity.status(404).body("Could not find product with id " + id);
        }
    }

}
