import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { AppParams } from 'src/app/interfaces';
import { ApiVersionService } from 'src/app/library/http/api-version.service';
import { APP_PARAMS } from './app-params';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private apiVersion: ApiVersionService,
  ) { }

  ngOnInit() {
    this.apiVersion.version$.pipe(
      filter(ver => ver.appBuild > this.params.version.appBuild),
    ).subscribe(() => location.reload());

  }


}
