import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, Subject, ReplaySubject, merge, Subscription } from 'rxjs';
import { tap, map, switchMap, takeUntil, filter, shareReplay, share, take } from 'rxjs/operators';
import { Product, CustomerProduct, JobProduct } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { JobEditDialogService } from '../../services/job-edit-dialog.service';

const COLUMNS = ['name', 'count', 'price', 'total', 'comment'];

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.css']
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  @Input() prodFormArray: FormArray;
  @Input() customerProducts$: Observable<CustomerProduct[]>;

  constructor(
    private service: JobEditDialogService,
    private ch: ChangeDetectorRef,
  ) { }

  get isEnabled(): boolean { return !this.prodFormArray.disabled; }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  addNewProduct() {
    this.prodFormArray.push(this.service.productFormGroup());
    this.ch.markForCheck();
  }

  removeProduct(idx: number) {
    this.prodFormArray.removeAt(idx);
    this.prodFormArray.markAsDirty();
    this.ch.markForCheck();
  }

}
