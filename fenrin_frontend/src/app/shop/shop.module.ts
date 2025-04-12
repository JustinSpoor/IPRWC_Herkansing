import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopPageComponent } from './shop-page/shop-page.component';
import { ShopRoutingModule } from './shop-routing.module';
import { ProductComponent} from './shop-page/product/product.component'
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProductFormComponent } from './shop-page/new-product-form/new-product-form.component';


@NgModule({
  declarations: [
    ShopPageComponent,
    ProductComponent,
    NewProductFormComponent
  ],
  imports: [
    CommonModule,
    ShopRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class ShopModule { }
