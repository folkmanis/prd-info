import { Directive, input } from '@angular/core';
import { outputFromObservable, toObservable } from '@angular/core/rxjs-interop';
import { combineLatest, debounceTime, filter, map } from 'rxjs';
import { CustomerProduct } from 'src/app/interfaces';

@Directive({
  selector: '[appProductControl]',
  standalone: true,
})
export class ProductControlDirective {

  selectedName = input<string>('', { alias: 'appProductControl' });

  customerProducts = input<CustomerProduct[]>([]);

  selectedProduct$ = combineLatest([
    toObservable(this.selectedName),
    toObservable(this.customerProducts)
  ])
    .pipe(
      filter(([name, products]) => !!name || !!products),
      debounceTime(300),
      map(([name, products]) =>
        products.find((product) => product.productName === name)
      ),
      filter((product) => !!product),
    );

  selectedProduct = outputFromObservable(this.selectedProduct$);

}
