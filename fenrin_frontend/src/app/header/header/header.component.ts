import { Component } from '@angular/core';
import { ShoppingCartService } from 'src/app/shop/shopping-cart.service';
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isLoggedIn?: boolean;
  totalQuantity$ = this.shoppingCartService.totalQuantity$;
  totalQuantity = 0;

  constructor(public authService: AuthService, private shoppingCartService: ShoppingCartService) {  }

  ngOnInit(): void {
    this.shoppingCartService.totalQuantity$.subscribe(quantity => {
      this.totalQuantity = quantity;
    })
  }

  ngDoCheck() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  logout(){
    this.authService.logout();
  }

}
