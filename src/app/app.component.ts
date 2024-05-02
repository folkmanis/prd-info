import { ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation, afterNextRender, inject } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ApiVersionService } from 'src/app/library/http/api-version.service';
import { getAppParams } from './app-params';
import { RouterOutlet } from '@angular/router';
import { ViewSizeDirective } from "src/app/library/view-size";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [RouterOutlet],
})
export class AppComponent {

  private appBuild = getAppParams('version', 'appBuild');
  private apiVersion$ = inject(ApiVersionService).version$;

  constructor() {
    afterNextRender(() => {
      this.apiVersion$
        .pipe(filter((ver) => ver.appBuild > this.appBuild))
        .subscribe(() => location.reload());
    });
  }

}
