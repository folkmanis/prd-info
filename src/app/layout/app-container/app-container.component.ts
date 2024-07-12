import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { map } from 'rxjs';
import { LoginService } from 'src/app/login';
import { SystemPreferencesService } from 'src/app/services';
import { AsyncPipe } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '../side-menu/side-menu.component';
import { ViewSizeModule } from '../../library/view-size/view-size.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ToolbarComponent } from '../toolbar/toolbar.component';

@Component({
  selector: 'app-app-container',
  templateUrl: './app-container.component.html',
  styleUrls: ['./app-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ToolbarComponent, MatSidenavModule, ViewSizeModule, SideMenuComponent, RouterOutlet, AsyncPipe],
})
export class AppContainerComponent {
  user$ = inject(LoginService).user$;

  activeModule$ = inject(SystemPreferencesService).activeModules$.pipe(map((modules) => modules[0]));
}
