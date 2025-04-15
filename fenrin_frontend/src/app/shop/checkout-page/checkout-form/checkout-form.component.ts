import { Component, EventEmitter, Output } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ShoppingCartService } from '../../shopping-cart.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.scss']
})
export class CheckoutFormComponent {
  checkoutForm: FormGroup;

  @Output() submitOrder = new EventEmitter<any>();

  constructor(private form: FormBuilder, private shoppingCartService: ShoppingCartService) {
    this.checkoutForm = this.form.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      address: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      zip: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10)]],
      city: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50), Validators.email]],
    });
  }

  getCartTotal() {
    return this.shoppingCartService.getCartTotal();
  }

  onSubmit() {
    if (this.checkoutForm.valid) {
      this.submitOrder.emit(this.checkoutForm.value);
    }
  }
}
