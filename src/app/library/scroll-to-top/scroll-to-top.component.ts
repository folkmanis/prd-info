import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ScrollTopDirective } from './scroll-top.directive';

@Component({
  templateUrl: './scroll-to-top.component.html',
  standalone: true,
  styleUrls: ['./scroll-to-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule],
})
export class ScrollToTopComponent {
  private scrollable = inject(ScrollTopDirective);

  visible = this.scrollable.visible;

  bottom = this.scrollable.bottom;

  right = this.scrollable.right;

  scrollToTop() {
    this.scrollable.scrollToTop();
  }
}
