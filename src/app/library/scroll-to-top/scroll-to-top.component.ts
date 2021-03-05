import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component } from '@angular/core';


@Component({
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollToTopComponent {

  visible = false;

  scrollable: CdkScrollable | undefined;

  scrollToTop() {
    this.scrollable?.scrollTo({ top: 0, behavior: 'smooth' });
  }

}
