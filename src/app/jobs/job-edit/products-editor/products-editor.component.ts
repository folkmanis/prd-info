import {
  ChangeDetectionStrategy, ChangeDetectorRef, Component,
  HostListener, OnDestroy, OnInit,
  QueryList, ViewChildren
} from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { IFormArray, IFormGroup } from '@rxweb/types';
import { combineLatest, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerProduct, JobProduct } from 'src/app/interfaces';
import { DestroyService } from 'src/app/library/rx/destroy.service';
import { JobEditFormService } from '../services/job-edit-form.service';
import { ProductAutocompleteComponent } from './product-autocomplete/product-autocomplete.component';

const COLUMNS = ['name', 'count', 'price', 'total', 'comment'];

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.scss'],
  providers: [DestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  @ViewChildren(ProductAutocompleteComponent) private nameInputs: QueryList<ProductAutocompleteComponent>;
  prodFormArray: IFormArray<JobProduct>;
  customerProducts$: Observable<CustomerProduct[]>;
  addNewProduct$ = new Subject<void>();

  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
      this.addNewProduct$.next();
    }
  }

  constructor(
    private ch: ChangeDetectorRef,
    private destroy$: DestroyService,
    private jobFormService: JobEditFormService,
    private controlContainer: ControlContainer,
  ) { }

  get isEnabled(): boolean {
    return !this.prodFormArray.disabled;
  }
  get isValid(): boolean {
    return !this.prodFormArray.disabled && this.prodFormArray.valid;
  }

  ngOnInit(): void {
    this.prodFormArray = this.controlContainer.control as IFormArray<JobProduct>;

    this.customerProducts$ = this.jobFormService.customerProducts$;
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
    const prodForm = this.jobFormService.productFormGroup();
    this.jobFormService.setProductGroupValidators(prodForm, products);
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
    frm.controls.forEach((contr: IFormGroup<JobProduct>) => this.jobFormService.setProductGroupValidators(contr, customerProducts));
  }


}
