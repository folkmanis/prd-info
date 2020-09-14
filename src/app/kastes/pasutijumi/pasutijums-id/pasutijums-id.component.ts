import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { share, tap, map, switchMap, filter, pluck } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { Colors, ColorTotals, KastesJob } from 'src/app/interfaces';
import { Observable, MonoTypeOperatorFunction, merge, of } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';

const NEW_ORDER: Partial<KastesJob> = {
  jobId: undefined,
  name: '',
  receivedDate: new Date(),
  dueDate: new Date(),
  apjomsPlanned: [],
};

@Component({
  selector: 'app-pasutijums-id',
  templateUrl: './pasutijums-id.component.html',
  styleUrls: ['./pasutijums-id.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasutijumsIdComponent implements CanComponentDeactivate {

  readonly colors: Colors[] = ['yellow', 'rose', 'white'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pasService: PasutijumiService,
    private fb: FormBuilder,
    private confirmation: ConfirmationDialogService,
  ) { }

  orderForm: FormGroup = this.fb.group({
    jobId: [{ disabled: true }],
    name: [
      '',
      [Validators.required, Validators.minLength(4)],
    ],
    deleted: [false],
    created: [{ value: '', disabled: true }],
    dueDate: [],
    apjomsPlanned: this.fb.array(
      this.colors.map(col => this.fb.group({
        color: [col],
        total: [0, [Validators.min(0)]],
      }))
    ),
  });
  get name(): FormControl { return this.orderForm.get('name') as FormControl; }
  get orderId(): FormControl { return this.orderForm.get('_id') as FormControl; }

  private id$: Observable<string> = this.route.paramMap.pipe(
    map(params => params.get('id')),
    filter(id => !!id),
  );
  private existingOrder$: Observable<KastesJob> = this.id$.pipe(
    filter(id => !isNaN(+id)),
    switchMap(id => this.pasService.getOrder(+id)),
    this.fillForm(this.orderForm),
  );

  private newOrder$: Observable<KastesJob> = this.id$.pipe(
    filter(id => id === 'new'),
    map(() => NEW_ORDER),
    this.fillForm(this.orderForm),
    tap(() => this.orderForm.get('created').enable()),
  );
  order$: Observable<KastesJob> = merge(this.existingOrder$, this.newOrder$).pipe(share());
  totals$ = this.order$.pipe(pluck('totals'));
  orderId$ = this.order$.pipe(pluck('_id'));

  onSave() {
    this.orderForm.markAsPristine();
    if (this.orderId.value) {
      this.pasService.updateOrder(this.orderForm.value)
        .subscribe(() => {
          this.router.navigate(['..'], { relativeTo: this.route });
        });
    } else {
      this.pasService.addOrder(this.orderForm.value)
        .subscribe(id => this.router.navigate(['..', id], { relativeTo: this.route }));
    }
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (this.orderForm.pristine) { return true; }
    return this.confirmation.discardChanges();
  }

  private fillForm(frm: FormGroup): MonoTypeOperatorFunction<KastesJob> {
    return (obs: Observable<KastesJob>): Observable<KastesJob> => {
      return obs.pipe(
        tap(ord => frm.patchValue(ord, { emitEvent: false }))
      );
    };
  }

}
