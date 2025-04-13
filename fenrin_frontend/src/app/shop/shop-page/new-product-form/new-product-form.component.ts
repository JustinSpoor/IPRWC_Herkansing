import { Component, ViewChild, ElementRef, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-product-form',
  templateUrl: './new-product-form.component.html',
  styleUrls: ['./new-product-form.component.scss']
})
export class NewProductFormComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Input() toBeUpdatedProduct: any;
  @Output() productAdded = new EventEmitter<any>();
  @Output() productUpdated = new EventEmitter<any>();
  @Output() removeProduct = new EventEmitter<any>();

  form: FormGroup;
  productName = '';
  currentlyUpdating = false;

  constructor(private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      name: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      description: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      category: ["", [Validators.required, Validators.minLength(1), Validators.maxLength(25)]],
      price: ["", [Validators.required, Validators.min(0), Validators.max(999)]],
      stock: ["", [Validators.required, Validators.min(0), Validators.max(99999)]],
      image: [null, [this.imageValidator]],
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    const toBeUpdatedProduct = changes['toBeUpdatedProduct']?.currentValue;
    if (toBeUpdatedProduct && (!this.currentlyUpdating || toBeUpdatedProduct.id !== changes['toBeUpdatedProduct']?.previousValue?.id)) {
      this.handleToBeUpdatedProduct(toBeUpdatedProduct);
    }
  }

  handleToBeUpdatedProduct(toBeUpdatedProduct: any) {
    this.toBeUpdatedProduct = toBeUpdatedProduct;
    this.currentlyUpdating = true;

    this.form.patchValue({
      name: toBeUpdatedProduct.name,
      description: toBeUpdatedProduct.description,
      category: toBeUpdatedProduct.category,
      price: toBeUpdatedProduct.price,
      stock: toBeUpdatedProduct.stock
    })

    const imageControl = this.form.get('image');
    imageControl?.clearValidators();
    imageControl?.updateValueAndValidity();
  }

  handleRemoveProduct() {
    if(this.currentlyUpdating) {
      this.productName = this.form.get('name')?.value;
      this.removeProduct.emit(this.toBeUpdatedProduct);
    }
  }


  imageValidator(control: AbstractControl): ValidationErrors | null {
    const file = control.value;

    if (!file) return { imageRequired: true };

    if(!(file instanceof File)) return { invalidType: true };

    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if(!allowedTypes.includes(file.type)) {
      return { invalidFileType: true };
    }

    return null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];

    if(file) {
      this.form.patchValue({image: file});
      this.form.get('image')?.updateValueAndValidity();
    }
  }

  resetForm() {
    this.currentlyUpdating = false;
    this.form.reset();


    if(this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit(){
    if(this.form.valid) {
      if(this.currentlyUpdating) {
        const updatedProduct = this.formatUpdatedProduct();
        this.productUpdated.emit(updatedProduct);
      }
      if(!this.currentlyUpdating) {
        const newProduct = this.formatNewProduct();
        this.productAdded.emit(newProduct);
      }
    }
  }

  formatNewProduct() {
    const formData = new FormData();

    this.productName = this.form.get('name')?.value;

    const product = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      category: this.form.get('category')?.value,
      price: this.form.get('price')?.value,
      stock: this.form.get('stock')?.value,
    };

    formData.append('product', new Blob([JSON.stringify(product)], {type: 'application/json'}));

    const imageFile = this.form.get('image')?.value

    formData.append('image', imageFile, imageFile.name);

    return formData;
  }

  formatUpdatedProduct() {
    this.productName = this.form.get('name')?.value;

    const updatedProduct = {
      id: this.toBeUpdatedProduct.id,
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      category: this.form.get('category')?.value,
      price: this.form.get('price')?.value,
      stock: this.form.get('stock')?.value,
    }

    return updatedProduct;
  }

}
