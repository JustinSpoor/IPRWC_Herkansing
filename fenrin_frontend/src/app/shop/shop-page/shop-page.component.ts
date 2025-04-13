import { Component, ViewChild } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from 'src/app/auth/auth.service';
import { ToastService } from 'src/app/shared/toast.service';
import { ShopService } from '../shop.service';
import { NewProductFormComponent } from './new-product-form/new-product-form.component';
import Swal from "sweetalert2";

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
  toBeUpdatedProduct: any;
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

  onProductToBeUpdated(toBeUpdatedProduct: any) {
    this.toBeUpdatedProduct = toBeUpdatedProduct;
    this.showNewProductModal = true;
  }

  closeModal() {
    this.showNewProductModal = false;
    this.newProductFormComponent.resetForm();

    setTimeout(() => {
      this.toBeUpdatedProduct = null;
    }, 0)
  }

  onProductAdded(newProduct: any) {
    this.shopService.saveProduct(newProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
        this.toasterService.showSuccess(`Het nieuwe product ${this.newProductFormComponent.productName} is toegevoegd.`, 'Toegevoegd');
      },
      error: () => {
        this.toasterService.showError(`Er is iets fout gegaan bij het toevoegen van ${this.newProductFormComponent.productName}.`, 'Error');
      }
    })
  }

  onProductUpdated(updatedProduct: any) {
    this.shopService.updateProduct(updatedProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.closeModal();
        this.toasterService.showSuccess(`Het product ${this.newProductFormComponent.productName} is gewijzigd.`, 'Gewijzijgd')
      },
      error: (error) => {
        if(error.toString().includes(404)) {
          this.toasterService.showError(`Het product dat je probeerd aan te passen bestaat niet`, 'Error');
        }
        if(error.toString().includes(409)) {
          this.toasterService.showError(`Er bestaat al een product met de naam ${this.newProductFormComponent.productName}`, 'Error')
        }
      }
    })
  }

  onRemoveProduct(toBeRemovedProduct: any) {
    Swal.fire({
      title: 'Weet je het zeker?',
      text: 'Deze actie is onomkeerbaar',
      color: 'white',
      showCancelButton: true,
      confirmButtonText: 'Verwijderen',
      cancelButtonText: 'Annuleren'
    }).then((result) => {
      if(result.isConfirmed) {
        this.shopService.deleteProduct(toBeRemovedProduct.id).subscribe({
          next: () => {
            this.loadProducts();
            this.closeModal();
            this.toasterService.showInfo(`Product verwijderd`, 'Verwijderd');
          },
          error: () => {
            this.toasterService.showError('Product was al verwijderd', 'Error');
          }
        });
      }
    });
  }

}
