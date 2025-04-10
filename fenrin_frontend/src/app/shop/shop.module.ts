import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ProductComponent} from './shop-page/product/product.component'


@NgModule({
  declarations: [
    ShopPageComponent,
    ProductComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
