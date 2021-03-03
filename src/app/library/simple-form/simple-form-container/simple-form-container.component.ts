import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService, log } from 'prd-cdk';
import { merge, Observable, Subject } from 'rxjs';
import { filter, last, map, shareReplay, take, takeUntil } from 'rxjs/operators';
import { SimpleFormSource } from '../simple-form-source';
import { SimpleFormLabelDirective } from './simple-form-label.directive';


@Component({
  selector: 'app-simple-form-container',
  templateUrl: './simple-form-container.component.html',
  styleUrls: ['./simple-form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class SimpleFormContainerComponent<T> implements OnInit, AfterViewInit, OnDestroy {

  @Input() set formSource(value: SimpleFormSource<T> | null) {
    this._formSource = value;
  }
  get formSource(): SimpleFormSource<T> | null {
    return this._formSource;
  }
  private _formSource: SimpleFormSource<T> | null = null;

  @Input() set data(data: T) {
    if (data) { this._data$.next(data); }
  }
  private _data$ = new Subject<T>();

  private _routerData$ = this.route.data.pipe(
    map(data => data.value as T | undefined),
    filter(value => !!value),
  );

  @Output() dataChange: Observable<T> = merge(this._data$, this._routerData$).pipe(
    shareReplay(1),
  );

  @ContentChild(SimpleFormLabelDirective)
  get label(): SimpleFormLabelDirective { return this._label; }
  set label(label: SimpleFormLabelDirective) {
    if (label) { this._label = label; }
  }
  private _label: SimpleFormLabelDirective;

  get form() { return this.formSource?.form; }

  get isSaveEnabled(): boolean {
    return this.form?.valid && !this.form.pristine;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  /** Ctrl-Enter triggers save */
  @HostListener('window:keydown', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && this.isSaveEnabled) {
      this.onSave();
    }
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    if (this.form) {
      this.form.statusChanges.pipe(
        takeUntil(this.destroy$),
      ).subscribe(_ => this.changeDetector.markForCheck());
    }
  }

  onResetForm(): void {
    this.dataChange.pipe(
      take(1),
    ).subscribe(data => this.formSource?.initValue(data, { emitEvent: false }));
  }

  ngOnDestroy(): void {
    this._data$.complete();
  }

  onSave() {
    if (!this.formSource) { return; }

    const value = this.form.value;
    if (!this.formSource.isNew) {
      this.formSource.updateFn(value).pipe(
        log('save'),
        last(),
      ).subscribe(res => this._data$.next(res));
    } else {
      this.formSource.insertFn(value).pipe(
        last(),
      ).subscribe(res => {
        this.form.markAsPristine();
        this.router.navigate(['..', res], { relativeTo: this.route });
      });
    }
  }


}
