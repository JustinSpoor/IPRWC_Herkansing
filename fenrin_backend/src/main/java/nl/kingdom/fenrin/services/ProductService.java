package nl.kingdom.fenrin.services;


import jdk.swing.interop.SwingInterOpUtils;
import nl.kingdom.fenrin.dto.NewProductDTO;
import nl.kingdom.fenrin.models.Product;
import nl.kingdom.fenrin.repositories.ProductRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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

    @Value("${VPS_HOST}")
    private String vpsHost;

    private static final Logger logger = LoggerFactory.getLogger(ProductService.class);

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
        logger.info("Saving new product: '{}'", product.getName());
        return this.productRepository.save(product);
    }

    public Product updateProduct(Product product) {
        logger.info("Updating product with ID: {}", product.getId());
        return this.productRepository.save(product);
    }

    public void deleteProduct(Product product) {
        logger.info("Deleting product with ID: {}", product.getId());
        deleteImageFromFileSystem(product.getImageUrl());

        this.productRepository.delete(product);
        logger.info("Product deleted successfully: {}", product.getId());
    }

    public void deleteImageFromFileSystem(String imageUrl) {
        try{
            String fileName = imageUrl.substring(imageUrl.lastIndexOf("/") + 1);

            String fullPath = uploadDir + File.separator + fileName;

            File file = new File(fullPath);

            if(file.exists()) {
                if(file.delete()) {
                    logger.info("Deleted image from filesystem: {}", fullPath);
                } else {
                    logger.warn("Failed to delete image from filesystem: {}", fullPath);
                }
            } else {
                logger.warn("Image file not found: {}", fullPath);
            }
        } catch (Exception e) {
            logger.error("Error while deleting image: {}", e.getMessage(), e);
        }
    }

    public String saveProductImage( MultipartFile image) throws IOException {
        File uploadDirectory = new File(uploadDir);
        if(!uploadDirectory.exists()) {
            uploadDirectory.mkdirs();
            logger.info("Created upload directory at: {}", uploadDir);
        }

        String imageName = image.getOriginalFilename();

        String sanitizedImageName = imageName.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");

        String randomId = UUID.randomUUID().toString();

        Path imagePath = Paths.get(uploadDir,  randomId + "_" + sanitizedImageName);

        File imageFile = imagePath.toFile();

        image.transferTo(imageFile);
        logger.info("Image saved successfully at: {}", imagePath);


        return "https://" + vpsHost + "/images/" + randomId + "_" + sanitizedImageName;
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
