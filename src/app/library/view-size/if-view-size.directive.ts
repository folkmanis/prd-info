import { OnInit, Directive, TemplateRef, ViewContainerRef, Input, EmbeddedViewRef, ChangeDetectorRef } from '@angular/core';
import { LayoutService, AppBreakpoints, BREAKPOINTS } from './layout.service';
import { DestroyService } from 'prd-cdk';
import { combineLatest, takeUntil, BehaviorSubject, switchMap } from 'rxjs';

@Directive({
  selector: '[appIfViewSize]',
  providers: [DestroyService],
})
export class IfViewSizeDirective implements OnInit {

  private readonly viewSize$ = new BehaviorSubject<AppBreakpoints>('large');

  private readonly elseTemplate$ = new BehaviorSubject<TemplateRef<any> | null>(null);

  private thenViewRef: EmbeddedViewRef<any> | null;
  private elseViewRef: EmbeddedViewRef<any> | null;

  @Input('appIfViewSize') set viewSize(value: AppBreakpoints) {
    if (typeof value === 'string' && BREAKPOINTS.includes(value)) {
      this.viewSize$.next(value);
    }
  }

  @Input('appIfViewSizeElse') set elseTemplate(value: TemplateRef<any> | null) {
    if (value == null || value.createEmbeddedView) {
      this.elseTemplate$.next(value);
    }
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private layout: LayoutService,
    private chDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    combineLatest([
      this.viewSize$.pipe(switchMap(size => this.layout.matches(size))),
      this.elseTemplate$
    ])
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe(([matches, elseTemplate]) => this.setView(matches, elseTemplate));
  }

  private setView(matches: boolean, elseTemplate: TemplateRef<any> | null) {
    if (matches) {
      if (!this.thenViewRef) {
        this.viewContainer.clear();
        this.elseViewRef = null;
        this.thenViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        this.chDetector.markForCheck();
      }
    } else {
      if (!this.elseViewRef) {
        this.viewContainer.clear();
        this.thenViewRef = null;
        if (elseTemplate) {
          this.elseViewRef = this.viewContainer.createEmbeddedView(elseTemplate);
          this.chDetector.markForCheck();
        }
      }
    }
  }

}
