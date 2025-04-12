package nl.kingdom.fenrin.services;


import jdk.swing.interop.SwingInterOpUtils;
import nl.kingdom.fenrin.dto.NewProductDTO;
import nl.kingdom.fenrin.models.Product;
import nl.kingdom.fenrin.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Value("${file.upload-dir}")
    private String uploadDir;

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

    public String saveProductImage( MultipartFile image) throws IOException {
        File uploadDirectory = new File(uploadDir);
        if(!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
        }

        String imageName = image.getOriginalFilename();

        String sanitizedImageName = imageName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

        String randomId = UUID.randomUUID().toString();

        Path imagePath = Paths.get(uploadDir,  randomId + "_" + sanitizedImageName);

        File imageFile = imagePath.toFile();

        image.transferTo(imageFile);

        return "http://localhost:8080/images/" + randomId + "_" + sanitizedImageName;
    }

    public Product formatNewProduct(NewProductDTO product, String imagePath) {
        Product newProduct = new Product();

        newProduct.setName(product.getName());
        newProduct.setDescription(product.getDescription());
        newProduct.setCategory(product.getCategory());
        newProduct.setPrice(product.getPrice());
        newProduct.setStock(product.getStock());
        newProduct.setImageUrl(imagePath);


        return newProduct;
    }

}
