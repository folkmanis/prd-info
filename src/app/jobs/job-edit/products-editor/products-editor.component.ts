import {
  ChangeDetectorRef, Component,
  ElementRef, HostListener, Input, OnDestroy, OnInit,
  QueryList, ViewChildren
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { CustomerProduct } from 'src/app/interfaces';
import { JobEditFormService } from '../../services/job-edit-form.service';

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
    private service: JobEditFormService,
    private ch: ChangeDetectorRef,
  ) { }

  get isEnabled(): boolean {
    return !this.prodFormArray.disabled;
  }
  get isValid(): boolean {
    return !this.prodFormArray.disabled && this.prodFormArray.valid;
  }

  ngOnInit(): void {
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
