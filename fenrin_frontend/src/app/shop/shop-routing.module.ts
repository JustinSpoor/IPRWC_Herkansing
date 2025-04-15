import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { ShopPageComponent } from './shop-page/shop-page.component'
import { ShoppingCartPageComponent } from "./shopping-cart-page/shopping-cart-page.component";
import { PlayerGuard } from "../auth/guards/player.guard";
import { CheckoutPageComponent } from "./checkout-page/checkout-page.component";

export const shopRoutes: Routes = [
  {
    path: 'shop',
    component: ShopPageComponent,
  },
  {
    path: 'cart',
    component: ShoppingCartPageComponent,
  },
  {
    path: 'checkout',
    component: CheckoutPageComponent,
    canActivate: [PlayerGuard]
  }
]

@NgModule({
  imports: [RouterModule.forChild(shopRoutes)],
  exports: [RouterModule]
})

export class ShopRoutingModule {}
