import { ChangeDetectionStrategy, Component, afterNextRender, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ApiVersionService } from 'src/app/library/http/api-version.service';
import { getAppParams } from './app-params';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterOutlet]
})
export class AppComponent {
  private appBuild = getAppParams('version', 'appBuild');
  private apiVersion$ = inject(ApiVersionService).version$;

  constructor() {
    afterNextRender(() => {
      this.apiVersion$.pipe(filter((ver) => ver.appBuild > this.appBuild)).subscribe(() => location.reload());
    });
  }
}
