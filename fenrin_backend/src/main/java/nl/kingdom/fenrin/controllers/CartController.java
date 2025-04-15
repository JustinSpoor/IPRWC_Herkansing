package nl.kingdom.fenrin.controllers;

import nl.kingdom.fenrin.dto.CartItemDTO;
import nl.kingdom.fenrin.services.CartService;
import nl.kingdom.fenrin.services.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private ProductService productService;

    @GetMapping("/cart/{username}")
    public ResponseEntity<List<CartItemDTO>> getCart(@PathVariable String username) {
        return ResponseEntity.ok(cartService.getCartList(username));
    }

    @PostMapping("/cart/{username}/{productId}")
    public ResponseEntity<?> addItemToCart(@PathVariable String username, @PathVariable UUID productId) {
        return cartService.addItemToCart(username, productId);
    }

    @PatchMapping("/cart/{username}/{productId}/{newQuantity}")
    public ResponseEntity<?> updateCartItemQuantity(@PathVariable String username, @PathVariable UUID productId, @PathVariable int newQuantity) {
        return cartService.updateCartItemQuantity(username, productId, newQuantity);
    }

    @DeleteMapping("/cart/{username}/{productId}")
    public ResponseEntity<?> removeCartItem(@PathVariable String username, @PathVariable UUID productId) {
        return cartService.removeCartItem(username, productId);
    }

    @DeleteMapping("/cart/{username}")
    public ResponseEntity<?> removeCart(@PathVariable String username) {
        this.cartService.removeCart(username);
        return ResponseEntity.ok().body(null);
    }
}
