import { ChangeDetectionStrategy, Component, input, output, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  templateUrl: './side-button.component.html',
  styleUrls: ['./side-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIconModule, MatButtonModule],
})
export class SideButtonComponent {
  opened = input(false);

  click = output();
}
