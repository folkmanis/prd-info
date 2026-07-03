import { Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  imports: [MatIconModule, MatButtonModule],
  standalone: true,
})
export class ScrollToTopComponent {
  visible = input(false);

  bottom = input('20px');

  right = input('80px');

  toTop = output();
}
