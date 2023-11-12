import {
  DestroyRef,
  Directive,
  Injector,
  Input,
  OnInit,
  Self,
  Signal,
  computed,
  effect,
  inject,
} from '@angular/core';
import { DestroyService } from 'src/app/library/rxjs';
import { combineLatest, Observable } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { CustomerProduct } from 'src/app/interfaces';
import { ReproProductComponent } from './repro-product.component';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';

@Directive({
  selector: 'app-repro-product[appProductControl]',
  standalone: true,
})
export class ProductControlDirective implements OnInit {
  private destroyRef = inject(DestroyRef);
  private injector = inject(Injector);

  constructor(@Self() private component: ReproProductComponent) {}

  ngOnInit(): void {
    const controls = this.component.productForm.controls;
    const customerProducts = toObservable(this.component.productsAvailable, {
      injector: this.injector,
    });
    const selectedName = controls.name.valueChanges;

    combineLatest([selectedName, customerProducts])
      .pipe(
        debounceTime(300),
        map(([value, products]) =>
          products.find((prod) => prod.productName === value)
        ),
        filter((product) => !!product),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((product) => {
        controls.units.setValue(product.units);
        controls.price.setValue(product.price);
      });
  }
}
