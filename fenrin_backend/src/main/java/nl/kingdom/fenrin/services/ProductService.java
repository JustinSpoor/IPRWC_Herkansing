package nl.kingdom.fenrin.services;


import nl.kingdom.fenrin.models.Product;
import nl.kingdom.fenrin.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getProducts() {
        return this.productRepository.findAll();
    }

    public Optional<Product> getProductById(UUID id) {
        return this.productRepository.findById(id);
    }

    public Optional<Product> getProductByName(String name) {
        return this.productRepository.findByName(name);
    }

    public Product saveProduct(Product product) {
        return this.productRepository.save(product);
    }

    public Product updateProduct(Product product) {
        return this.productRepository.save(product);
    }

    public void deleteProduct(Product product) {
        this.productRepository.delete(product);
    }

}
