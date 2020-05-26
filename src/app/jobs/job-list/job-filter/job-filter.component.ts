import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap, map, debounceTime } from 'rxjs/operators';
import { pickBy, identity } from 'lodash';
import { CustomersService } from 'src/app/services';
import { JobQueryFilter, JobProduct } from 'src/app/interfaces';

const NULL_CUSTOMER = { CustomerName: undefined, _id: undefined, code: undefined };

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.css']
})
export class JobFilterComponent implements OnInit, OnDestroy {
  filterForm: FormGroup;

  private readonly _subs = new Subscription();
  customers$ = this.customersService.customers$.pipe(
    map(customers => [NULL_CUSTOMER, ...customers])
  );


  constructor(
    private fb: FormBuilder,
    private customersService: CustomersService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.filterForm = this.fb.group({
      name: [''],
      customer: [''],
    });

  }
  get name(): FormControl { return this.filterForm.get('name') as FormControl; }
  get customer(): FormControl { return this.filterForm.get('customer') as FormControl; }

  ngOnInit(): void {
    this._subs.add(
      this.filterForm.valueChanges.pipe(
        debounceTime(200),
        map(filter => ({
          name: filter.name ? filter.name as string : undefined,
          customer: filter.customer ? filter.customer as string : undefined,
        } as JobQueryFilter)),
        map(filter => pickBy(filter, identity)),
      ).subscribe(filter => this.router.navigate([filter]))
    );
    this.filterForm.patchValue(this.route.snapshot.params, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

}
