import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductFormComponent } from './new-product-form.component';

describe('NewProductFormComponent', () => {
  let component: NewProductFormComponent;
  let fixture: ComponentFixture<NewProductFormComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewProductFormComponent]
    });
    fixture = TestBed.createComponent(NewProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
