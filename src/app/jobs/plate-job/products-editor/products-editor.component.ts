import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { MatTable } from '@angular/material/table';
import { Observable, of, Subject, merge, combineLatest } from 'rxjs';
import { tap, map, switchMap, takeUntil, filter } from 'rxjs/operators';
import { ProductsService } from '../../services';
import { Product, CustomerProduct } from '../../services/product';
import { JobProduct } from '../../services/job';

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.css']
})
export class ProductsEditorComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatTable) table: MatTable<FormGroup>;
  @Input('productForm') set _form(_frm: FormArray) {
    this.productForm = _frm;
    this.startProducts$.next(_frm);
  }
  @Input() set customer(_c: string) {
    this.customer$.next(_c);
  }
  @Output() productsChange: EventEmitter<JobProduct[]> = new EventEmitter();

  constructor(
    private productsService: ProductsService,
    private fb: FormBuilder,
  ) { }
  readonly displayedColumns: string[] = ['name', 'count', 'price', 'total', 'comment', 'buttons'];

  customer$: Subject<string> = new Subject();

  products$: Observable<CustomerProduct[]> = this.customer$.pipe(
    filter(customer => customer && customer.length > 0),
    switchMap(customer => this.productsService.productsCustomer(customer)),
  );

  addProduct$: Subject<void> = new Subject();
  removeProduct$: Subject<number> = new Subject();
  startProducts$: Subject<FormArray> = new Subject();
  productForm = this.fb.array([]);

  unsub: Subject<void> = new Subject();

  productsData$: Observable<FormGroup[]> = merge(
    this.addProduct$.pipe(
      map(() => this.addProduct()),
    ),
    this.removeProduct$.pipe(
      map(idx => this.removeProduct(idx)),
    ),
    this.startProducts$
  )
    .pipe(
      map(formArr => (formArr.controls as FormGroup[])),
    );

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    this.unsub.next();
  }

  private addProduct(): FormArray {
    this.productForm.push(
      this.fb.group({
        name: [],
        price: [],
        comment: [],
        count: [],
      })
    );
    return this.productForm;
  }

  private removeProduct(idx: number): FormArray {
    this.productForm.removeAt(idx);
    this.productForm.markAsDirty();
    return this.productForm;
  }


}
