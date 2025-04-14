import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-shopping-cart-page',
  templateUrl: './shopping-cart-page.component.html',
  styleUrls: ['./shopping-cart-page.component.scss']
})
export class ShoppingCartPageComponent {
  cart: any = [];

  constructor(private authService: AuthService, private shoppingCartService: ShoppingCartService) {
  }

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    if(this.authService.isLoggedIn()) {
      //retrieve cart from backend
    } else {
      this.cart = this.shoppingCartService.getCartItems();
    }
  }

  updateCartItemQuantity(cartItem: any) {
    this.shoppingCartService.updateQuantity(cartItem);
  }

  removeCartItem(cartItem: any) {
    this.cart = this.cart.filter((item: any) => item.productId !== cartItem.productId);
    this.shoppingCartService.removeItem(cartItem.productId);
  }

  getCartTotal() {
    return this.shoppingCartService.getCartTotal();
  }

}
