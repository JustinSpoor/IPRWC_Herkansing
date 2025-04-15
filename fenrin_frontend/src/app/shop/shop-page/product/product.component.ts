import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ShoppingCartService } from '../../shopping-cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Output() toBeUpdatedProduct = new EventEmitter<any>();
  @Input() product!: {
    id: string,
    name: string,
    description: string,
    category: string,
    price: number,
    stock: number,
    imageUrl: string,
  };

  message = '';

  constructor(private toasterService: ToastService, private shoppingCartService: ShoppingCartService, public authService: AuthService) {
  }

  editProduct(toBeUpdatedProduct: any) {
    this.toBeUpdatedProduct.emit(toBeUpdatedProduct);
  }

  addToCart(product: any) {
    const item = {
      productId: this.product.id,
      name: this.product.name,
      description: this.product.description,
      price: this.product.price,
      quantity: 1,
      stock: this.product.stock,
      imageUrl: this.product.imageUrl
    }

    this.shoppingCartService.addToCart(item)
  }



}
