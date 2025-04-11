import { Component } from '@angular/core';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-shop-page',
  templateUrl: './shop-page.component.html',
  styleUrls: ['./shop-page.component.scss']
})
export class ShopPageComponent {
  products = [];
  searchTerm: string = '';
  selectedCategory: string = 'All';

  constructor(private shopService: ShopService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.shopService.getProducts().subscribe(products => {
      this.products = products;
    })
  }

  getCategories(): string[] {
    const unique = new Set(this.products.map((p: any) => p.category));
    return ['All', ...Array.from(unique)];
  }

  getFilteredProducts() {
    return this.products.filter((product: any) => {
      const matchesSearch =
        product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesCategory =
        this.selectedCategory === 'All' || product.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  addProduct() {

  }

}
