import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SystemSettings, LoginService } from 'src/app/login/login.service';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-log-filter',
  templateUrl: './log-filter.component.html',
  styleUrls: ['./log-filter.component.css']
})
export class LogFilterComponent implements OnInit {

  constructor(
    private loginService: LoginService,
  ) { }

  filterForm = new FormGroup({
    logLevel: new FormControl(0)
  });

  logLevels$: Observable<{ key: number, value: string; }[]> = this.loginService.sysPreferences$.pipe(
    map(pref => pref.get('system')),
    map(pref => (<SystemSettings>pref).logLevels),
    map(levels => levels.map(level => ({ key: level[0], value: level[1] }))),
    tap(level => this.filterForm.patchValue({
      logLevel: level.reduce((acc, curr) => curr.key > acc ? curr.key : acc, 0)
    }),
    )
  );

  ngOnInit(): void {
  }

}
