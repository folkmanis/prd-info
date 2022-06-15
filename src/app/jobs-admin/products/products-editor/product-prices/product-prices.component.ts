import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { DestroyService } from 'prd-cdk';
import { merge } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerPartial } from 'src/app/interfaces';


@Component({
  selector: 'app-product-prices',
  templateUrl: './product-prices.component.html',
  styleUrls: ['./product-prices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class ProductPricesComponent implements OnInit {

  @Input() pricesFormArray: UntypedFormArray;
  @Input() customers: CustomerPartial[] = [];

  @Output() removePrice = new EventEmitter<number>();

  constructor(
    private chDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  get pricesControls() { return this.pricesFormArray.controls as UntypedFormGroup[]; }

  customerNameControl(group: AbstractControl) {
    return group.get('customerName') as UntypedFormControl;
  }

  priceControl(group: AbstractControl) {
    return group.get('price') as UntypedFormControl;
  }

  ngOnInit(): void {
    merge(
      this.pricesFormArray.valueChanges,
      this.pricesFormArray.statusChanges,
    ).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => this.chDetector.markForCheck());
  }


}
