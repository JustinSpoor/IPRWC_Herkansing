import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-product-form',
  templateUrl: './new-product-form.component.html',
  styleUrls: ['./new-product-form.component.scss']
})
export class NewProductFormComponent {
  form: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef;
  @Output() productAdded = new EventEmitter<any>();

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
    this.form.reset();
    if(this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onSubmit(){
    if(this.form.valid) {
      const newProduct = this.formatNewProduct();

      this.productAdded.emit(newProduct);
    }
  }

  formatNewProduct() {
    return {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      category: this.form.get('category')?.value,
      price: this.form.get('price')?.value,
      stock: this.form.get('stock')?.value,
      image: this.form.get('image')?.value,
    }
  }

}
