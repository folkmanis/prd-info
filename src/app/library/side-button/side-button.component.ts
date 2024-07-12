import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  templateUrl: './side-button.component.html',
  standalone: true,
  styleUrls: ['./side-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule, MatButtonModule],
})
export class SideButtonComponent {
  opened: Signal<boolean> = signal(false);
  drawer?: MatDrawer;

  onClick() {
    this.drawer?.toggle();
  }
}
