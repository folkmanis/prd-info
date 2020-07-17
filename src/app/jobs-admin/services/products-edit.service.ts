import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProductPrice } from 'src/app/interfaces';

@Injectable({
  providedIn: 'any'
})
export class ProductsEditService {

  constructor(
    private fb: FormBuilder,
  ) { }

  createPriceFormGroup(price?: ProductPrice): FormGroup {
    return this.fb.group({
      customerName: [
        price?.customerName,
        {
          validators: Validators.required,
        }
      ],
      price: [
        price?.price,
        {
          validators: [Validators.required, Validators.pattern(/[0-9]{1,}(((,|\.)[0-9]{0,2})?)/)]
        }
      ],
    });
  }

}
