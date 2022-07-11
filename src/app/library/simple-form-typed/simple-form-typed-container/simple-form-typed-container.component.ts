import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService, log } from 'prd-cdk';
import { filter, last, map, takeUntil } from 'rxjs';
import { SimpleFormTypedControl } from '../simple-form-typed-control';

@Component({
  selector: 'app-simple-form-typed-container',
  templateUrl: './simple-form-typed-container.component.html',
  styleUrls: ['./simple-form-typed-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    DestroyService,
  ]
})
export class SimpleFormTypedContainerComponent<T> implements OnInit, AfterViewInit {

  private routerData$ = this.route.data.pipe(
    map(data => data.value as T | undefined),
    filter(value => !!value),
  );

  get isSaveEnabled(): boolean {
    const form = this.content.form;
    return form.valid && this.isChanges;
  }

  get isResetEnabled(): boolean {
    return !this.content.isNew && this.isChanges;
  }

  get isChanges(): boolean {
    return this.content.form.dirty && !!this.content.changes;
  }


  constructor(
    private changeDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(SimpleFormTypedControl) private content: SimpleFormTypedControl<T>,
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
    this.content.stateChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe(() => this.changeDetector.markForCheck());
  }

  ngAfterViewInit(): void {
    this.routerData$.subscribe(value => this.content.onData(value));
  }

  onSave({ leave }: { leave?: boolean; } = {}) {

    if (this.content.isNew) {

      this.content.onCreate().pipe(
        last(),
      ).subscribe(value => {
        this.content.form.markAsPristine();
        leave ? this.close() : this.router.navigate(['..', value], { relativeTo: this.route });
      });

    } else {

      this.content.onUpdate().pipe(
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
