import { Directive, EmbeddedViewRef, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest, map, switchMap } from 'rxjs';
import { AppBreakpoints, BREAKPOINTS, LayoutService } from '../layout.service';

interface ViewSize {
  breakPoint: AppBreakpoints;
  not: boolean;
}

@Directive()
export class ViewSizeBase implements OnInit, OnDestroy {
  private readonly viewSize$ = new BehaviorSubject<ViewSize>({ breakPoint: 'large', not: false });

  private readonly elseTemplate$ = new BehaviorSubject<TemplateRef<any> | null>(null);

  private thenViewRef: EmbeddedViewRef<any> | null;
  private elseViewRef: EmbeddedViewRef<any> | null;

  private subs: Subscription;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private layout: LayoutService,
  ) {}

  setViewSize(breakPoint: AppBreakpoints, not = false) {
    if (typeof breakPoint === 'string' && BREAKPOINTS.includes(breakPoint)) {
      this.viewSize$.next({ breakPoint, not });
    }
  }

  setElseTemplate(value: TemplateRef<any> | null) {
    if (value == null || value.createEmbeddedView) {
      this.elseTemplate$.next(value);
    }
  }

  ngOnInit(): void {
    const matches$ = this.viewSize$.pipe(switchMap((size) => this.layout.matches(size.breakPoint).pipe(map((match) => (size.not ? !match : match)))));

    this.subs = combineLatest([matches$, this.elseTemplate$])
      .pipe()
      .subscribe(([matches, elseTemplate]) => this.setView(matches, elseTemplate));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private setView(matches: boolean, elseTemplate: TemplateRef<any> | null) {
    if (matches) {
      if (!this.thenViewRef) {
        this.viewContainer.clear();
        this.elseViewRef = null;
        this.thenViewRef = this.viewContainer.createEmbeddedView(this.templateRef);
        this.thenViewRef.markForCheck();
      }
    } else {
      if (!this.elseViewRef) {
        this.viewContainer.clear();
        this.thenViewRef = null;
        if (elseTemplate) {
          this.elseViewRef = this.viewContainer.createEmbeddedView(elseTemplate);
          this.elseViewRef.markForCheck();
        }
      }
    }
  }
}
