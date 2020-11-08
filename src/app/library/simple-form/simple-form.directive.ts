import { Directive, Inject, OnDestroy, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SimpleFormContainerComponent } from './simple-form-container/simple-form-container.component';
import { SimpleFormSource } from './simple-form-source';

@Directive({
  selector: '[appSimpleForm]'
})
export class SimpleFormDirective<T> implements OnInit, OnDestroy {
  @Input('appSimpleForm') formSource: SimpleFormSource<T>;

  private get form() { return this.formSource.form; }

  set initialValue(value: Partial<T>) {
    this.formSource.initValue(value, { emitEvent: false });
    this._initialValue = value;
  }
  get initialValue(): Partial<T> { return this._initialValue; }
  private _initialValue: Partial<T>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    @Inject(SimpleFormContainerComponent) private simpleContainer: SimpleFormContainerComponent<T>,
  ) { }

  private readonly _subs = new Subscription();

  ngOnInit(): void {
    this.simpleContainer.form = this.form;
    const data$ = this.route.data.pipe(
      map(data => data.value),
      filter(value => !!value),
    );
    this._subs.add(
      data$.subscribe(data => this.initialValue = data)
    );
    this._subs.add(
      this.simpleContainer.resetForm
        .subscribe(() => this.formSource.initValue(this.initialValue, { emitEvent: false }))
    );
    this._subs.add(
      this.simpleContainer.saveForm
        .subscribe(() => this.onSave())
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  private onSave() {
    const value = this.form.value;
    if (!this.formSource.isNew) {
      this.formSource.updateFn(value).subscribe(res => {
        this.initialValue = res;
      });
    } else {
      this.formSource.insertFn(value).subscribe(res => {
        this.form.markAsPristine();
        this.router.navigate(['..', res], { relativeTo: this.route });
      });
    }
  }


}
