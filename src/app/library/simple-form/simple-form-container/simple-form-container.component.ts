import { Component, EventEmitter, OnInit, OnDestroy, Output, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { SimpleFormSource } from '../simple-form-source';


@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss']
})
export class SimpleFormContainerComponent<T> implements OnInit, OnDestroy {
  @Input() formSource: SimpleFormSource<T> | undefined;

  @Output() dataChange: Observable<T> = this.route.data.pipe(
    map(data => data.value as T | undefined),
    filter(value => !!value),
  );

  get form() { return this.formSource.form; }

  set initialValue(value: Partial<T>) {
    this._initialValue = value;
    this.formSource?.initValue(value, { emitEvent: false });
  }
  get initialValue(): Partial<T> { return this._initialValue; }
  private _initialValue: Partial<T>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  private readonly _subs = new Subscription();

  ngOnInit(): void {
    this._subs.add(
      this.dataChange.subscribe(data => this.initialValue = data)
    );
  }

  onResetForm(): void {
    this.formSource?.initValue(this.initialValue, { emitEvent: false });
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  onSave() {
    if (!this.formSource) { return; }

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
