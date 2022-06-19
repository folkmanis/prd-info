import { ContentChild, ChangeDetectionStrategy, Component, HostListener, OnInit, AfterContentInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { SimpleFormTypedControl } from '../simple-form-typed-control';
import { DestroyService } from 'prd-cdk';
import { filter, last, map, merge, Observable, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-simple-form-typed-container',
  templateUrl: './simple-form-typed-container.component.html',
  styleUrls: ['./simple-form-typed-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
  ]
})
export class SimpleFormTypedContainerComponent<T> implements OnInit, AfterViewInit, AfterContentInit {

  private _content: SimpleFormTypedControl<T>;
  @ContentChild(SimpleFormTypedControl) set content(value: SimpleFormTypedControl<T>) {
    console.log(value);
    this._content = value;
  }
  get content() {
    return this._content;
  }

  data$: Observable<T>;

  private routerData$ = this.route.data.pipe(
    map(data => data.value as T | undefined),
    filter(value => !!value),
  );

  get isSaveEnabled(): boolean {
    const form = this.content.form;
    return form.valid && !form.pristine && this.isChanges;
  }

  get isChanges(): boolean {
    return !!this.content.changes;
  }


  constructor(
    private changeDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  /** Ctrl-Enter triggers save */
  @HostListener('window:keyup', ['$event']) keyEvent(event: KeyboardEvent) {
    if (event.key === 'Enter' && event.ctrlKey && this.isSaveEnabled) {
      const leave = event.shiftKey; // +Shift closes
      event.stopPropagation();
      event.preventDefault();
      this.onSave({ leave });
    }
  }

  ngOnInit(): void {
  }


  ngAfterViewInit(): void {
    this.routerData$.subscribe(value => this.content.onData(value));
  }

  ngAfterContentInit(): void {
    console.log(this.content);
    this.content.stateChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());
  }

  onSave({ leave }: { leave?: boolean; } = {}) {

    if (this.content.isNew) {

      this.content.onCreate().pipe(
        last(),
      ).subscribe(value => {
        leave ? this.close() : this.router.navigate(['..', value], { relativeTo: this.route });
      });

    } else {

      this.content.onSave().pipe(
        last(),
      ).subscribe(value => {
        this.content.onData(value);
        leave && this.close();
      });

    }
  }

  close() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  onResetForm(): void {
    this.content.onReset();
  }


}
