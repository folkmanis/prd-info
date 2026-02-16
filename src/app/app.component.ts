import { ChangeDetectionStrategy, Component, afterNextRender, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ApiVersionService } from 'src/app/library/http/api-version.service';
import { getAppParams } from './app-params';
import { LoginService } from './login';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
  host: {
    '[style.color-scheme]': 'colorScheme()',
  },
})
export class AppComponent {
  private appBuild = getAppParams('version', 'appBuild');
  private apiVersion$ = inject(ApiVersionService).version$;

  #user = inject(LoginService).user;
  protected colorScheme = computed(() => (this.#user()?.prefersDarkMode ? 'dark' : 'light'));

  constructor() {
    afterNextRender(() => {
      this.apiVersion$.pipe(filter((ver) => ver.appBuild > this.appBuild)).subscribe(() => location.reload());
    });
  }
}
