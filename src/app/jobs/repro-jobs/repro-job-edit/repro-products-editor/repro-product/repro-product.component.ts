import { CurrencyPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Output, ViewChild, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { CustomerProduct } from 'src/app/interfaces';
import { ViewSizeModule } from '../../../../../library/view-size/view-size.module';
import { ProductAutocompleteComponent } from '../product-autocomplete/product-autocomplete.component';
import { JobProductForm } from './job-product-form.interface';


@Component({
  selector: 'app-repro-product',
  templateUrl: './repro-product.component.html',
  styleUrls: ['./repro-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ViewSizeModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    MatIconModule,
    ProductAutocompleteComponent,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    CurrencyPipe,
  ],
})
export class ReproProductComponent {

  @ViewChild(ProductAutocompleteComponent)
  productNameControl: ProductAutocompleteComponent;

  productsAvailable = signal<CustomerProduct[]>([]);


  @Input({ required: true }) productForm: JobProductForm;

  @Input()
  set customerProducts(value: CustomerProduct[]) {
    this.productsAvailable.set(value || []);
  }

  @Input() showPrices: boolean = false;

  @Output() remove = new Subject<void>();


  focus() {
    this.productNameControl.focus();
  }

  onSetPrice() {
    const price = this.productsAvailable().find(prod => prod.productName === this.productForm.value.name)?.price;
    if (price) {
      this.productForm.controls.price.setValue(price);
    }
  }



}
