import { CdkScrollable } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';


@Component({
  templateUrl: './scroll-to-top.component.html',
  standalone: true,
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ]
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
