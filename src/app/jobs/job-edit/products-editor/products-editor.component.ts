import {
  ChangeDetectorRef, Component,
  HostListener, Input, OnDestroy, OnInit,
  QueryList, ViewChildren
} from '@angular/core';
import { IFormArray, IFormGroup, IFormControl } from '@rxweb/types';
import { Observable, Subject, combineLatest } from 'rxjs';
import { CustomerProduct, JobProduct } from 'src/app/interfaces';
import { JobEditFormService } from '../../services/job-edit-form.service';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';
import { ValidatorFn, Validators, ValidationErrors } from '@angular/forms';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { takeUntil } from 'rxjs/operators';

const COLUMNS = ['name', 'count', 'price', 'total', 'comment'];

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.css'],
  providers: [DestroyService],
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  @ViewChildren(ProductAutocompleteComponent) private nameInputs: QueryList<ProductAutocompleteComponent>;
  @Input() prodFormArray: IFormArray<JobProduct>;
  @Input() customerProducts$: Observable<CustomerProduct[]>;

  addNewProduct$ = new Subject<void>();

  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
      this.addNewProduct$.next();
    }
  }

  constructor(
    private service: JobEditFormService,
    private ch: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  get isEnabled(): boolean {
    return !this.prodFormArray.disabled;
  }
  get isValid(): boolean {
    return !this.prodFormArray.disabled && this.prodFormArray.valid;
  }

  ngOnInit(): void {
    this.customerProducts$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(prod => this.setArrayValidators(this.prodFormArray, prod));

    combineLatest([this.customerProducts$, this.addNewProduct$]).pipe(
      takeUntil(this.destroy$),
    ).subscribe(([products, _]) => this.addNewProduct(products));
  }

  ngOnDestroy(): void {
  }

  addNewProduct(products: CustomerProduct[]) {
    if (!this.isValid) { return; }
    const prodForm = this.service.productFormGroup();
    this.service.setProductGroupValidators(prodForm, products);
    this.prodFormArray.push(prodForm);
    this.ch.markForCheck();
    setTimeout(() => {
      this.nameInputs.last.focus();
    }, 0);
  }

  removeProduct(idx: number) {
    this.prodFormArray.removeAt(idx);
    this.prodFormArray.markAsDirty();
    this.ch.markForCheck();
  }

  private setArrayValidators(frm: IFormArray<JobProduct>, customerProducts: CustomerProduct[]) {
    frm.controls.forEach((contr: IFormGroup<JobProduct>) => this.service.setProductGroupValidators(contr, customerProducts));
  }


}
