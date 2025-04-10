import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import { ShopPageComponent } from './shop-page/shop-page.component'

export const shopRoutes: Routes = [
  {
    path: 'shop',
    component: ShopPageComponent,
  }
]

@NgModule({
  imports: [RouterModule.forChild(shopRoutes)],
  exports: [RouterModule]
})

export class ShopRoutingModule {}
