import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs';
import { LoginService } from 'src/app/login';
import { SystemPreferencesService } from 'src/app/services';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';
import { DrawerSmallDirective } from 'src/app/library/view-size';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ToolbarComponent, MatSidenavModule, SideMenuComponent, RouterOutlet, DrawerSmallDirective],
})
export class AppContainerComponent {
  private activeModules = inject(SystemPreferencesService).activeModules;

  user = inject(LoginService).user;

  activeModule = computed(() => this.activeModules()[0]);
}
