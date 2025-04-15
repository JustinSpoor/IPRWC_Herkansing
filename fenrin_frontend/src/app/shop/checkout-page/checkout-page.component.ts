import {Component} from '@angular/core';
import {ToastService} from 'src/app/shared/toast.service';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPageComponent {


  constructor(private toasterService: ToastService, private shoppingCartService: ShoppingCartService) {
  }

  onSubmitOrder(orderData: any) {
    //Hier zou de bestelling daadwerkelijk geplaatst worden
    this.shoppingCartService.removeCart();
  }

}
