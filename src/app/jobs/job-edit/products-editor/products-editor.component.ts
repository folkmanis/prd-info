import {
  Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnDestroy, OnChanges, SimpleChanges,
  ChangeDetectorRef, HostListener, ViewChild, ViewChildren, ElementRef, QueryList
} from '@angular/core';
import { FormArray, FormBuilder, Validators, FormGroup, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, Subject, ReplaySubject, merge, Subscription } from 'rxjs';
import { tap, map, switchMap, takeUntil, filter, shareReplay, share, take } from 'rxjs/operators';
import { Product, CustomerProduct, JobProduct } from 'src/app/interfaces';
import { ProductsService } from 'src/app/services';
import { JobEditDialogService } from '../../services/job-edit-dialog.service';
import { ProductForOfDirective } from '../product-for.directive';

const COLUMNS = ['name', 'count', 'price', 'total', 'comment'];

@Component({
  selector: 'app-products-editor',
  templateUrl: './products-editor.component.html',
  styleUrls: ['./products-editor.component.css']
})
export class ProductsEditorComponent implements OnInit, OnDestroy {
  @ViewChildren('name') private nameInputs: QueryList<ElementRef>;
  @Input() prodFormArray: FormArray;
  @Input() customerProducts$: Observable<CustomerProduct[]>;

  /** Ctrl-+ event */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === '+' && event.ctrlKey) {
      event.preventDefault();
      this.addNewProduct();
    }
  }

  constructor(
    private service: JobEditDialogService,
    private ch: ChangeDetectorRef,
  ) { }

  get isEnabled(): boolean {
    return !this.prodFormArray.disabled;
  }
  get isValid(): boolean {
    return !this.prodFormArray.disabled && this.prodFormArray.valid;
  }

  ngOnInit(): void {
    // this.nameInputs.changes.subscribe(inp => console.log(inp));
  }

  ngOnDestroy(): void {
  }

  addNewProduct() {
    if (!this.isValid) { return; }
    this.prodFormArray.push(this.service.productFormGroup());
    this.ch.markForCheck();
    setTimeout(() => {
      (this.nameInputs.last.nativeElement as HTMLInputElement).focus();
    }, 0);
  }

  removeProduct(idx: number) {
    this.prodFormArray.removeAt(idx);
    this.prodFormArray.markAsDirty();
    this.ch.markForCheck();
  }

}
