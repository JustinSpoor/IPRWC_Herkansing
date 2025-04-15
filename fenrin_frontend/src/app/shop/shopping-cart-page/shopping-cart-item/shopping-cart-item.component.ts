import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-shopping-cart-item',
  templateUrl: './shopping-cart-item.component.html',
  styleUrls: ['./shopping-cart-item.component.scss']
})
export class ShoppingCartItemComponent {
  @Input() cartItem!: {
    productId: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    stock: number,
    imageUrl: string
  };

  @Output() quantityUpdated = new EventEmitter<any>();
  @Output() itemRemoved = new EventEmitter<any>();

  getTotalPrice(): number {
    return this.cartItem.price * this.cartItem.quantity;
  }


  increaseQuantity() {
    if (this.cartItem.quantity < this.cartItem.stock) {
      this.cartItem.quantity += 1;
      this.quantityUpdated.emit({...this.cartItem});
    }
  }

  decreaseQuantity() {
    if(this.cartItem.quantity > 0) {
      this.cartItem.quantity -= 1;
      this.quantityUpdated.emit({...this.cartItem});
    }

    if(this.cartItem.quantity == 0) {
      this.removeItem();
    }
  }

  removeItem() {
    this.itemRemoved.emit(this.cartItem)
  }

}
