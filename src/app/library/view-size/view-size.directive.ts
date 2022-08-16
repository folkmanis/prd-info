import { ChangeDetectorRef, Directive, HostBinding, OnInit, Output } from '@angular/core';
import { DestroyService } from 'prd-cdk';
import { takeUntil } from 'rxjs';
import { LayoutService } from './layout.service';


@Directive({
  selector: '[appViewSize]',
  providers: [DestroyService],
  exportAs: 'viewSize',
})
export class ViewSizeDirective implements OnInit {

  @Output('appViewIsLarge')
  isLarge$ = this.layoutService.isLarge$;

  @Output('appViewIsMedium')
  isMedium$ = this.layoutService.isMedium$;

  @Output('appViewIsSmall')
  isSmall$ = this.layoutService.isSmall$;

  @HostBinding('class.large') isLarge = false;

  @HostBinding('class.medium') isMedium = false;

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

    this.isMedium$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(medium => this.setMedium(medium));

    this.isSmall$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(small => this.setSmall(small));

  }


  private setLarge(large: boolean) {
    this.isLarge = large;
    this.chDetector.markForCheck();
  }

  private setMedium(medium: boolean) {
    this.isMedium = medium;
    this.chDetector.markForCheck();
  }

  private setSmall(small: boolean) {
    this.isSmall = small;
    this.chDetector.markForCheck();
  }

}
