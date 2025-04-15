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


    public List<CartItemDTO> getCartList(String username) {
        Optional<MyUser> user = myUserRepository.findByUsername(username);

        if(user.isPresent()) {
            Optional<Cart> cartOptional = cartRepository.findByUserId(user.get().getId());

            Cart cart;
            if(cartOptional.isPresent()) {
                cart = cartOptional.get();
            } else {
                cart = new Cart(user.get(), new ArrayList<>());
                cartRepository.save(cart);
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

            return cartItemDTOList;
        }
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
                cart = new Cart(user.get(), new ArrayList<>());
                cartRepository.save(cart);
            }

            return cart;
        }
        return null;
    }

    public ResponseEntity<?> addItemToCart(String username, UUID productId) {

        Optional<Product> checkIfProductExists = this.productService.getProductById(productId);

        if (checkIfProductExists.isEmpty()) {
            return ResponseEntity.status(404).body("Product does not exist");
        }
        Product product = checkIfProductExists.get();

        Optional<MyUser> user = this.myUserRepository.findByUsername(username);

        if (user.isEmpty()) {
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
                return ResponseEntity.status(400).body("Not enough stock available.");
            }
            existingItem.setQuantity(newQuantity);

        } else {
            if(product.getStock() < 1) {
                return ResponseEntity.status(400).body("Product is out of stock.");
            }

            CartItem newCartItem = new CartItem();
            newCartItem.setCart(userCart);
            newCartItem.setProduct(product);
            newCartItem.setQuantity(1);

            userCart.getCartItems().add(newCartItem);
        }
        return ResponseEntity.ok(this.cartRepository.save(userCart));
    }

    public ResponseEntity<?> updateCartItemQuantity(String username, UUID productId, int newQuantity) {
        Optional<MyUser> userOptional = this.myUserRepository.findByUsername(username);

        if(userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User does not exist");
        }

        Optional<Product> productOptional = this.productService.getProductById(productId);

        if(productOptional.isEmpty()) {
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
            } else {
                cart.getCartItems().remove(existingItem);
            }
        }
        return ResponseEntity.ok(cartRepository.save(cart));
    }

    public ResponseEntity<?> removeCartItem(String username, UUID productId) {
        Optional<MyUser> userOptional = this.myUserRepository.findByUsername(username);

        if(userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User does not exist");
        }

        Optional<Product> productOptional = this.productService.getProductById(productId);

        if(productOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Product does not exist");
        }

        Cart cart = this.getCart(username);

        boolean removed = cart.getCartItems().removeIf(
                item -> item.getProduct().getId().equals(productId)
        );

        if (removed) {
            return ResponseEntity.ok(cartRepository.save(cart));
        }

        return ResponseEntity.status(404).body("Product does not exist");
    }

    public ResponseEntity<?> removeCart(String username) {
        Optional<MyUser> userOptional = this.myUserRepository.findByUsername(username);

        if(userOptional.isEmpty()) {
            return ResponseEntity.status(404).body("User does not exist");
        }

        Optional<Cart> cartOptional = cartRepository.findByUserId(userOptional.get().getId());

        if (cartOptional.isEmpty()) {
            return ResponseEntity.status(404).body("Cart does not exist");
        }
        cartRepository.delete(cartOptional.get());

        return ResponseEntity.ok("Cart deleted successfully.");
    }
}
