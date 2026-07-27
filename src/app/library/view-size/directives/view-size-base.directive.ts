import { Directive, EmbeddedViewRef, OnDestroy, OnInit, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { BehaviorSubject, Subscription, combineLatest, map, switchMap } from 'rxjs';
import { AppBreakpoints, BREAKPOINTS, LayoutService } from '../layout.service';

interface ViewSize {
  breakPoint: AppBreakpoints;
  not: boolean;
}

@Directive()
export class ViewSizeBase implements OnInit, OnDestroy {
  private templateRef = inject<TemplateRef<unknown>>(TemplateRef);
  private viewContainer = inject(ViewContainerRef);
  private layout = inject(LayoutService);

  private readonly viewSize$ = new BehaviorSubject<ViewSize>({ breakPoint: 'large', not: false });

  private readonly elseTemplate$ = new BehaviorSubject<TemplateRef<unknown> | null>(null);

  private thenViewRef: EmbeddedViewRef<unknown> | null = null;
  private elseViewRef: EmbeddedViewRef<unknown> | null = null;

  private subs?: Subscription;

  setViewSize(breakPoint: AppBreakpoints, not = false) {
    if (typeof breakPoint === 'string' && BREAKPOINTS.includes(breakPoint)) {
      this.viewSize$.next({ breakPoint, not });
    }
  }

  setElseTemplate(value: TemplateRef<unknown> | null) {
    if (value instanceof TemplateRef) {
      this.elseTemplate$.next(value);
    }
  }

  ngOnInit(): void {
    const matches$ = this.viewSize$.pipe(
      switchMap((size) => this.layout.matches(size.breakPoint).pipe(map((match) => (size.not ? !match : match)))),
    );

    this.subs = combineLatest([matches$, this.elseTemplate$])
      .pipe()
      .subscribe(([matches, elseTemplate]) => this.setView(matches, elseTemplate));
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

  private setView(matches: boolean, elseTemplate: TemplateRef<unknown> | null) {
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
