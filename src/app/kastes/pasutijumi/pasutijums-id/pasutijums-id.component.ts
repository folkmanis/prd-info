import { Component, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { share, tap, map, switchMap, filter, pluck } from 'rxjs/operators';
import { PasutijumiService } from '../../services/pasutijumi.service';
import { KastesOrder, Colors, ColorTotals } from 'src/app/interfaces';
import { Observable, MonoTypeOperatorFunction, merge, of } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';

const NEW_ORDER: KastesOrder = {
  _id: undefined,
  name: '',
  deleted: false,
  created: new Date(),
  dueDate: new Date(),
  isLocked: false,
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
    _id: [{ disabled: true }],
    name: [
      '',
      [Validators.required, Validators.minLength(4)],
      [this.pasService.existPasutijumsValidatorFn()]
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
  private existingOrder$: Observable<KastesOrder> = this.id$.pipe(
    filter(id => id.length === 24),
    switchMap(id => this.pasService.getOrder(id)),
    this.fillForm(this.orderForm),
  );

  private newOrder$: Observable<KastesOrder> = this.id$.pipe(
    filter(id => id === 'new'),
    map(() => NEW_ORDER),
    this.fillForm(this.orderForm),
    tap(() => this.orderForm.get('created').enable()),
  );
  order$: Observable<KastesOrder> = merge(this.existingOrder$, this.newOrder$).pipe(share());
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

  private fillForm(frm: FormGroup): MonoTypeOperatorFunction<KastesOrder> {
    return (obs: Observable<KastesOrder>): Observable<KastesOrder> => {
      return obs.pipe(
        tap(ord => frm.patchValue(ord, { emitEvent: false }))
      );
    };
  }

}
