import { ChangeDetectionStrategy, Component, ElementRef, Injector, Input, OnInit, Signal, ViewChild, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CustomerProduct } from 'src/app/interfaces';

@Component({
    selector: 'app-product-autocomplete',
    templateUrl: './product-autocomplete.component.html',
    styleUrls: ['./product-autocomplete.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatAutocompleteModule, ReactiveFormsModule, MatButtonModule, MatIconModule, MatOptionModule]
})
export class ProductAutocompleteComponent implements OnInit {
  @ViewChild('name') private inputElement: ElementRef<HTMLInputElement>;

  @Input({ required: true }) control: FormControl<string>;

  productsAvailable = signal<CustomerProduct[]>([]);
  @Input()
  set customerProducts(value: CustomerProduct[]) {
    this.productsAvailable.set(value);
  }

  firstProducts: Signal<CustomerProduct[]>;
  restProducts: Signal<CustomerProduct[]>;

  private injector = inject(Injector);

  ngOnInit(): void {
    const value = toSignal(this.control.valueChanges, {
      injector: this.injector,
      initialValue: '',
    });
    const filtered = computed(() => this.filterProducts(value(), this.productsAvailable()));
    this.firstProducts = computed(() => filtered().filter((pr) => pr.price !== undefined));
    this.restProducts = computed(() => filtered().filter((pr) => pr.price == undefined));
  }

  focus(): void {
    (this.inputElement.nativeElement as HTMLInputElement).focus();
  }

  private filterProducts(controlValue: string, products: CustomerProduct[]): CustomerProduct[] {
    const name = controlValue?.toUpperCase();
    return products.filter((pr) => pr.productName.toUpperCase().includes(name));
  }
}
