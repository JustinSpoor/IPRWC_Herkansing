import { Component, ViewChild } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ShopService } from '../shop.service';
import { NewProductFormComponent } from './new-product-form/new-product-form.component';

@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.scss']
})
export class ShopPageComponent {
  products = [];
  searchTerm: string = '';
  selectedCategory: string = 'Alles';
  filteredProducts = [];
  showNewProductModal = false;
  @ViewChild(NewProductFormComponent) newProductFormComponent!: NewProductFormComponent;

  constructor(private shopService: ShopService, public authService: AuthService, private toasterService: ToastService) {
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.shopService.getProducts().subscribe(products => {
      this.products = products;
      this.filteredProducts = products;
    })
  }

  getCategories(): string[] {
    const unique = new Set(this.products.map((p: any) => p.category));
    return ['Alles', ...Array.from(unique)];
  }

  getFilteredProducts() {
    this.filteredProducts = this.products.filter((product: any) => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'Alles' || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
    return this.filteredProducts;
  }

  addProduct() {
    this.showNewProductModal = true;
  }

  closeModal() {
    this.showNewProductModal = false;
    this.newProductFormComponent.resetForm();
  }

  onProductAdded(newProduct: any) {
    this.closeModal();
    console.log(newProduct)
  }


}
