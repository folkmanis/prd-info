import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterOutlet } from '@angular/router';
import { DrawerSmallDirective } from 'src/app/library/view-size';
import { LoginService } from 'src/app/login';
import { SystemPreferencesService } from 'src/app/services';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ToolbarComponent, MatSidenavModule, SideMenuComponent, RouterOutlet, DrawerSmallDirective],
  host: {
    '[class.dark-theme]': 'darkTheme()',
  },
})
export class AppContainerComponent {
  private activeModules = inject(SystemPreferencesService).activeModules;
  private loginService = inject(LoginService);

  user = this.loginService.user;

  darkTheme = computed(() => this.user()?.prefersDarkMode);

  activeModule = computed(() => this.activeModules()[0]);

  async setDarkMode(isDark: boolean) {
    this.loginService.updateUser({ prefersDarkMode: isDark });
  }
}
