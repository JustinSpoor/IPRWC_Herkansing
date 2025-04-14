import {Injectable} from "@angular/core";
import { AuthService } from "../auth/auth.service";
import {HttpService} from "../shared/http.service";
import { ToastService } from "../shared/toast.service";

const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  private items: any = [];

  constructor(private authService: AuthService, private toasterService: ToastService) {
    this.loadCartFromStorage()
  }


  private loadCartFromStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    this.items = storedCart ? JSON.parse(storedCart) : [];
  }

  private saveCartToStorage() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  }

  getCartItems() {
    return this.items;
  }

  getCartTotal() {
    return this.items.reduce((total: any, item: any) => {
      return total + item.price * item.quantity;
    }, 0)
  }

  addToCart(product: any) {
    if(this.authService.isLoggedIn()) {
      //TODO send added to card to backend

    } else {
      const existingItem: any = this.items.find((item: any) => item.productId === product.productId)
      if (existingItem) {
        if (existingItem.quantity + product.quantity <= product.stock) {
          existingItem.quantity += product.quantity;
        } else {
          this.toasterService.showWarning('Niet genoeg voorraad beschikbaar', 'Waarschuwing')
          return;
        }
      } else {
        if (product.quantity <= product.stock) {
          this.items.push(product);
        } else {
          return;
        }
      }
    }

    this.saveCartToStorage();
  }

  updateQuantity(cartItem: any) {
    const existingItem: any = this.items.find((item: any) => item.productId === cartItem.productId);
    if (existingItem) {
      existingItem.quantity = cartItem.quantity;
      this.saveCartToStorage();
    }
  }

  removeItem(productId: string) {
    this.items = this.items.filter((item: any) => item.productId !== productId);
    this.saveCartToStorage();
  }

}
