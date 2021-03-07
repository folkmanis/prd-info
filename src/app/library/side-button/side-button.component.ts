import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  templateUrl: './side-button.component.html',
  styleUrls: ['./side-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SideButtonComponent {

  opened = false;
  drawer: MatDrawer;

  onClick() {
    this.drawer?.toggle();
  }

}
