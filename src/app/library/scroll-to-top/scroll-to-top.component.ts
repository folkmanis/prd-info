import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';


@Component({
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopComponent {

  visible = false;

  scrollable: CdkScrollable | undefined;

  bottom?: string;

  right?: string;

  scrollToTop() {
    this.scrollable?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
