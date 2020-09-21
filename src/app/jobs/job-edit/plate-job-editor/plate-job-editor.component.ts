import { Component, HostListener, Input, OnDestroy, OnInit } from '@angular/core';
import { IFormGroup } from '@rxweb/types';
import * as moment from 'moment';
import { combineLatest, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CustomerPartial, CustomerProduct, JobBase, JobsSettings } from 'src/app/interfaces';
import { LayoutService } from 'src/app/layout/layout.service';
import { ClipboardService } from 'src/app/library/services/clipboard.service';
import { CustomersService, SystemPreferencesService } from 'src/app/services';

@Component({
  selector: 'app-plate-job-editor',
  templateUrl: './plate-job-editor.component.html',
  styleUrls: ['./plate-job-editor.component.css']
})
export class PlateJobEditorComponent implements OnInit, OnDestroy {
  @Input() jobFormGroup: IFormGroup<JobBase>;
  @Input() customerProducts$: Observable<CustomerProduct[]>;

  constructor(
    private customersService: CustomersService,
    private sysPref: SystemPreferencesService,
    private clipboard: ClipboardService,
    private layoutService: LayoutService,
  ) { }

  get customerControl() { return this.jobFormGroup.controls.customer; }
  get nameControl() { return this.jobFormGroup.controls.name; }
  get productsControl() { return this.jobFormGroup.controls.products; }

  customers$: Observable<CustomerPartial[]>;
  jobStates$ = (this.sysPref.getModulePreferences('jobs') as Observable<JobsSettings>).pipe(
    map(pref => pref.jobStates.filter(st => st.state < 50))
  );
  categories$ = (this.sysPref.getModulePreferences('jobs') as Observable<JobsSettings>).pipe(
    map(pref => pref.productCategories),
  );

  large$: Observable<boolean> = this.layoutService.isLarge$;

  receivedDate = {
    min: moment().startOf('week'),
    max: moment().endOf('week'),
  };


  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.code === 'KeyC' && event.ctrlKey && !event.altKey) {
      this.copyJobIdAndName();
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.customers$ = combineLatest([
      this.customersService.customers$.pipe(
        map(customers => customers.filter(cust => !cust.disabled)),
      ),
      this.customerControl.valueChanges.pipe(
        startWith(''),
      ),
    ]).pipe(
      map(filterCustomer)
    );
  }

  ngOnDestroy(): void {
  }

  isProductsSet(): boolean {
    return this.customerControl.valid || (this.productsControl.value instanceof Array && this.productsControl.value.length > 0);
  }

  copyJobIdAndName() {
    this.clipboard.copy(`${this.jobFormGroup.get('jobId').value}-${this.jobFormGroup.get('name').value}`);
  }

}

function filterCustomer([customers, value]: [CustomerPartial[], string]): CustomerPartial[] {
  const filterValue = new RegExp(value, 'i');
  return customers.filter(state => filterValue.test(state.CustomerName));
}
