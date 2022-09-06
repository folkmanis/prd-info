import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter } from 'rxjs/operators';
import { ApiVersionService } from 'src/app/library/http/api-version.service';
import { getAppParams } from './app-params';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  private readonly appBuild = getAppParams('version', 'appBuild');

  constructor(
    private apiVersion: ApiVersionService,
  ) { }


  ngOnInit() {
    this.apiVersion.version$.pipe(
      filter(ver => ver.appBuild > this.appBuild),
    ).subscribe(() => location.reload());

  }


}
