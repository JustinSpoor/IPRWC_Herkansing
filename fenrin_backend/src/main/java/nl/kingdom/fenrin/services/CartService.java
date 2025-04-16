package nl.kingdom.fenrin.services;

import nl.kingdom.fenrin.dto.CartItemDTO;
import nl.kingdom.fenrin.models.Cart;
import nl.kingdom.fenrin.models.CartItem;
import nl.kingdom.fenrin.models.MyUser;
import nl.kingdom.fenrin.models.Product;
import nl.kingdom.fenrin.repositories.CartRepository;
import nl.kingdom.fenrin.repositories.MyUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private MyUserRepository myUserRepository;

    @Autowired
    private ProductService productService;

    private static final Logger logger = LoggerFactory.getLogger(CartService.class);


    public List<CartItemDTO> getCartList(String username) {
        if (username == null || username.isBlank() || !isValidUsername(username)) {
            logger.warn("Invalid username input for getCartList: '{}'", username);
            return null;
        }

        Optional<MyUser> user = myUserRepository.findByUsername(username);

        if(user.isPresent()) {
            Optional<Cart> cartOptional = cartRepository.findByUserId(user.get().getId());

            Cart cart;
            if(cartOptional.isPresent()) {
                cart = cartOptional.get();
            } else {
                logger.info("No cart found for user '{}', creating new cart...", username);
                cart = new Cart(user.get(), new ArrayList<>());
                cartRepository.save(cart);
                logger.info("New cart created and saved for user '{}'", username);
            }

            List<CartItemDTO> cartItemDTOList = new ArrayList<>();

            for (CartItem item : cart.getCartItems()) {
                cartItemDTOList.add(new CartItemDTO(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getDescription(),
                        item.getProduct().getCategory(),
                        item.getProduct().getPrice(),
                        item.getProduct().getStock(),
                        item.getProduct().getImageUrl(),
                        item.getQuantity()
                ));
            }
            logger.info("Successfully retrieved cart items for user '{}'", username);
            return cartItemDTOList;
        }
        logger.error("User '{}' not found in the system", username);
        return null;
    }

    public Cart getCart(String username) {
        Optional<MyUser> user = myUserRepository.findByUsername(username);

        if(user.isPresent()) {
            Optional<Cart> cartOptional = this.cartRepository.findByUserId(user.get().getId());

            Cart cart;
            if(cartOptional.isPresent()) {
                cart = cartOptional.get();
            } else {
                logger.info("No cart found for user '{}', creating a new cart.", username);
                cart = new Cart(user.get(), new ArrayList<>());
                cartRepository.save(cart);
                logger.info("New cart created and saved for user '{}'", username);
            }

            return cart;
        }
        logger.error("User '{}' not found in the system.", username);
        return null;
    }

    public ResponseEntity<?> addItemToCart(String username, UUID productId) {

        if (username == null || username.isBlank() || !isValidUsername(username)) {
            logger.error("Invalid username provided: '{}'.", username);
            return ResponseEntity.status(400).body("Invalid username");
        }

        Optional<Product> checkIfProductExists = this.productService.getProductById(productId);

        if (checkIfProductExists.isEmpty()) {
            logger.error("Product with ID '{}' does not exist.", productId);
            return ResponseEntity.status(404).body("Product does not exist");
        }
        Product product = checkIfProductExists.get();

        Optional<MyUser> user = this.myUserRepository.findByUsername(username);

        if (user.isEmpty()) {
            logger.error("User '{}' does not exist in the system.", username);
            return ResponseEntity.status(404).body("User does not exist");
        }

        Cart userCart = this.getCart(username);

        CartItem existingItem = userCart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            int newQuantity = existingItem.getQuantity() + 1;

            if(newQuantity > product.getStock()) {
                logger.warn("Not enough stock available for product '{}' to update cart quantity.", productId);
                return ResponseEntity.status(400).body("Not enough stock available.");
            }
            existingItem.setQuantity(newQuantity);
            logger.info("Product '{}' quantity updated to '{}'.", productId, newQuantity);

        } else {
            if(product.getStock() < 1) {
                logger.warn("Product '{}' is out of stock and cannot be added to the cart.", productId);
                return ResponseEntity.status(400).body("Product is out of stock.");
            }

            CartItem newCartItem = new CartItem();
            newCartItem.setCart(userCart);
            newCartItem.setProduct(product);
            newCartItem.setQuantity(1);

            userCart.getCartItems().add(newCartItem);
            logger.info("Product '{}' added to cart with quantity '1'.", productId);
        }
        logger.info("Cart for user '{}' successfully updated.", username);
        return ResponseEntity.ok(this.cartRepository.save(userCart));
    }

    public ResponseEntity<?> updateCartItemQuantity(String username, UUID productId, int newQuantity) {

        if (username == null || username.isBlank() || !isValidUsername(username)) {
            logger.error("Invalid username provided: '{}'", username);
            return ResponseEntity.status(400).body("Invalid username");
        }

        if (newQuantity < 0 || newQuantity > 999) {
            logger.warn("Invalid quantity '{}' provided for product '{}'", newQuantity, productId);
            return ResponseEntity.status(400).body("Invalid quantity");
        }

        Optional<MyUser> userOptional = this.myUserRepository.findByUsername(username);

        if(userOptional.isEmpty()) {
            logger.error("User '{}' not found", username);
            return ResponseEntity.status(404).body("User does not exist");
        }

        Optional<Product> productOptional = this.productService.getProductById(productId);

        if(productOptional.isEmpty()) {
            logger.error("Product '{}' not found", productId);
            return ResponseEntity.status(404).body("Product does not exist");
        }

        Cart cart = this.getCart(username);

        CartItem existingItem = cart.getCartItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .orElse(null);

        if (existingItem != null) {
            if (newQuantity > 0) {
                existingItem.setQuantity(newQuantity);
                logger.info("Updated quantity for product '{}' in cart to '{}'", productId, newQuantity);
            } else {
                cart.getCartItems().remove(existingItem);
                logger.info("Removed product '{}' from cart because new quantity was zero", productId);
            }
        } else {
            logger.warn("Attempted to update product '{}' but it does not exist in the cart", productId);
            return ResponseEntity.status(404).body("Item doesnt exist in cart");
        }
        logger.info("Cart successfully updated for user '{}'", username);
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    public ResponseEntity<?> removeCartItem(String username, UUID productId) {

        if (username == null || username.isBlank() || !isValidUsername(username)) {
            logger.warn("Invalid username provided: '{}'", username);
            return ResponseEntity.status(400).body("Invalid username");
        }

        Optional<MyUser> userOptional = this.myUserRepository.findByUsername(username);

        if(userOptional.isEmpty()) {
            logger.warn("User '{}' not found", username);
            return ResponseEntity.status(404).body("User does not exist");
        }

        Optional<Product> productOptional = this.productService.getProductById(productId);

        if(productOptional.isEmpty()) {
            logger.warn("Product '{}' not found", productId);
            return ResponseEntity.status(404).body("Product does not exist");
        }

        Cart cart = this.getCart(username);

        boolean removed = cart.getCartItems().removeIf(
                item -> item.getProduct().getId().equals(productId)
        );

        if (removed) {
            logger.info("Product '{}' removed from cart for user '{}'", productId, username);
            return ResponseEntity.ok(cartRepository.save(cart));
        }

        logger.warn("Product '{}' not found in cart for user '{}'", productId, username);
        return ResponseEntity.status(404).body("Product does not exist");
    }

    public ResponseEntity<?> removeCart(String username) {

        if (username == null || username.isBlank() || !isValidUsername(username)) {
            logger.warn("Invalid username provided: '{}'", username);
            return ResponseEntity.status(400).body("Invalid username");
        }

        Optional<MyUser> userOptional = this.myUserRepository.findByUsername(username);

        if(userOptional.isEmpty()) {
            logger.warn("User '{}' not found", username);
            return ResponseEntity.status(404).body("User does not exist");
        }

        Optional<Cart> cartOptional = cartRepository.findByUserId(userOptional.get().getId());

        if (cartOptional.isEmpty()) {
            logger.warn("No cart found for user '{}'", username);
            return ResponseEntity.status(404).body("Cart does not exist");
        }
        cartRepository.delete(cartOptional.get());
        logger.info("Cart deleted successfully for user '{}'", username);
        return ResponseEntity.ok("Cart deleted successfully.");
    }

    private boolean isValidUsername(String username) {
        return username != null && username.matches("^[a-zA-Z0-9._-]{3,50}$");
    }

}
