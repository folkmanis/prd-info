import { Output, Directive, HostBinding, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LayoutService } from './layout.service';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appIsLarge]'
})
export class IsLargeDirective implements OnInit, OnDestroy {

  @Output('appViewIsLarge')
  isLarge$ = this.layoutService.isLarge$;

  @HostBinding('class.large') isLarge = false;

  private subs: Subscription | null = null;

  constructor(
    private layoutService: LayoutService,
    private chDetector: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.subs = this.isLarge$.subscribe(large => this.setViewSize(large));
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private setViewSize(large: boolean) {
    this.isLarge = large;
    this.chDetector.markForCheck();
  }

}
