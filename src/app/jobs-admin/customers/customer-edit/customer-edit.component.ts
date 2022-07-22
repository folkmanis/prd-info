import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from 'prd-cdk';
import { map, merge, Observable, takeUntil } from 'rxjs';
import { Customer, SystemPreferences } from 'src/app/interfaces';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { CONFIG } from 'src/app/services/config.provider';
import { CustomerFormService } from '../services/customer-form.service';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    CustomerFormService,
    DestroyService,
  ],
})
export class CustomerEditComponent implements OnInit, CanComponentDeactivate {

  @ViewChild('paytraqPanel') paytraqPanel: MatExpansionPanel;

  readonly paytraqDisabled$ = this.config$.pipe(
    map(config => !config.paytraq.enabled),
  );

  form = this.formService.form;

  get changes(): Partial<Customer> | null {
    return this.formService.changes;
  }

  constructor(
    @Inject(CONFIG) private config$: Observable<SystemPreferences>,
    private formService: CustomerFormService,
    private route: ActivatedRoute,
    private router: Router,
    private destroy$: DestroyService,
    private changeDetector: ChangeDetectorRef,
  ) { }

  onReset(): void {
    this.formService.reset();
    this.paytraqPanel?.close();
  }

  onSave(): void {
    this.formService.save()
      .subscribe(c => this.router.navigate(['..', c._id], { relativeTo: this.route }));
  }

  ngOnInit(): void {
    this.route.data.pipe(
      map(data => data.value as Customer),
      takeUntil(this.destroy$),
    ).subscribe(customer => this.formService.setInitial(customer));

    merge(this.form.valueChanges, this.form.statusChanges).pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());
  }

  canDeactivate(): boolean {
    return this.form.pristine || !this.formService.changes;
  }


}
