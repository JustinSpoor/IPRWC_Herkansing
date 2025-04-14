import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-page',
  templateUrl: './shopping-cart-page.component.html',
  styleUrls: ['./shopping-cart-page.component.scss']
})
export class ShoppingCartPageComponent {
  cart$ = this.shoppingCartService.cartItems$;


  constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService) {
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    if(this.authService.isLoggedIn()) {
      this.shoppingCartService.loadCartFromBackend()
    } else {
      this.shoppingCartService.loadCartFromStorage();
    }
  }

  updateCartItemQuantity(cartItem: any) {
    this.shoppingCartService.updateQuantity(cartItem);
  }

  removeCartItem(cartItem: any) {
    this.shoppingCartService.removeItem(cartItem.productId);
  }

  getCartTotal() {
    return this.shoppingCartService.getCartTotal();
  }

}
