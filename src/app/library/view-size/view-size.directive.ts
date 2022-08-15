import { Output, Directive, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from './layout.service';
import { takeUntil } from 'rxjs';
import { DestroyService } from 'prd-cdk';


@Directive({
  selector: '[appViewSize]',
  providers: [DestroyService],
  exportAs: 'viewSize',
})
export class ViewSizeDirective implements OnInit {

  @Output('appViewIsLarge')
  isLarge$ = this.layoutService.isLarge$;

  @Output('appViewIsSmall')
  isSmall$ = this.layoutService.isSmall$;

  @HostBinding('class.large') isLarge = false;

  @HostBinding('class.small') isSmall = false;

  constructor(
    private layoutService: LayoutService,
    private chDetector: ChangeDetectorRef,
    private destroy$: DestroyService,
  ) { }

  ngOnInit(): void {
    this.isLarge$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(large => this.setLarge(large));

    this.isSmall$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(small => this.setSmall(small));
  }


  private setLarge(large: boolean) {
    this.isLarge = large;
    this.chDetector.markForCheck();
  }

  private setSmall(small: boolean) {
    this.isSmall = small;
    this.chDetector.markForCheck();
  }

}
