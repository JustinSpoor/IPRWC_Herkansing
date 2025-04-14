import {Injectable} from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import {HttpService} from "../shared/http.service";
import { ToastService } from "../shared/toast.service";

const CART_KEY = 'cart';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  cartRoute: string = 'cart';
  private cartItemsSubject = new BehaviorSubject<any[]>([]);
  cartItems$: Observable<any[]> = this.cartItemsSubject.asObservable();


  private items: any = [];

  constructor(private authService: AuthService, private toasterService: ToastService, private httpService: HttpService) {
    if(this.authService.isLoggedIn()) {
      this.loadCartFromBackend();
    } else {
      this.loadCartFromStorage()
    }
  }


  loadCartFromStorage() {
    const storedCart = localStorage.getItem(CART_KEY);
    const parsed = storedCart ? JSON.parse(storedCart) : [];
    this.updateCartItems(parsed);
  }

  loadCartFromBackend() {
    return this.httpService.httpGet(this.cartRoute + `/${this.authService.getUsername().toString()}`).subscribe((items: any) => {
      this.updateCartItems(items);
    });
  }

  private saveCartToStorage() {
    localStorage.setItem(CART_KEY, JSON.stringify(this.items));
  }

  private updateCartItems(newItems: any[]) {
    newItems.sort((a, b) => a.name.localeCompare(b.name));

    this.items = newItems;
    this.cartItemsSubject.next(this.items);

    if (!this.authService.isLoggedIn()) {
      this.saveCartToStorage();
    }
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
      this.httpService.httpPost(this.cartRoute + `/${this.authService.getUsername()}/${product.productId}`, null).subscribe({
        next: () => {
          this.loadCartFromBackend();
        },
        error: (error) => {
          this.toasterService.showWarning('Niet genoeg voorraad beschikbaar', 'Waarschuwing');
        }
      });
    } else {
      const existingItem: any = this.items.find((item: any) => item.productId === product.productId);
      if (existingItem) {
        if (existingItem.quantity + product.quantity <= product.stock) {
          existingItem.quantity += product.quantity;
        } else {
          this.toasterService.showWarning('Niet genoeg voorraad beschikbaar', 'Waarschuwing');
          return;
        }
      } else {
        if (product.quantity <= product.stock) {
          this.items.push(product);
        } else {
          return;
        }
      }
      this.updateCartItems([...this.items]);
    }
  }

  updateQuantity(cartItem: any) {
    const existingItem = this.items.find((item: any) => item.productId === cartItem.productId);
    if (existingItem) {
      existingItem.quantity = cartItem.quantity;
      if (this.authService.isLoggedIn()) {
        this.httpService.httpPatch(`${this.cartRoute}/${this.authService.getUsername()}/${cartItem.productId}/${cartItem.quantity}`, null).subscribe(() =>
          this.loadCartFromBackend());
      } else {
        this.updateCartItems([...this.items]);
      }
    }
  }

  removeItem(productId: string) {
    const filteredItems = this.items.filter((item: any) => item.productId !== productId);

    if (this.authService.isLoggedIn()) {
      this.httpService.httpDelete(`${this.cartRoute}/${this.authService.getUsername()}`, productId)
        .subscribe(() => this.loadCartFromBackend());
    } else {
      this.updateCartItems(filteredItems);
    }
  }
}
