import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  @Output() toBeUpdatedProduct = new EventEmitter<any>();
  @Input() product!: {
    name: string,
    description: string,
    category: string,
    price: number,
    stock: number,
    imageUrl: string,
  };

  message = '';

  constructor(private toasterService: ToastService, public authService: AuthService) {
  }

  editProduct(toBeUpdatedProduct: any) {
    this.toBeUpdatedProduct.emit(toBeUpdatedProduct);
  }

  addToCart(product: any) {
  //  TODO: add shopping cart functionality

    //TODO: deze functionaliteit naar parrent verplaatsen?
    this.toasterService.showSuccess(`${product.name} toegevoegd aan winkelwagen`, 'Toegevoegd');
  }
}
