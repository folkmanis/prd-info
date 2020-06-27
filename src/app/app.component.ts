import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoginService } from 'src/app/services';
import { LayoutService } from './layout/layout.service';

const panels = ['top', 'side'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {

  isLarge$ = this.layoutService.isLarge$;

  // Vai atvērt sānu menu pie ielādes
  opened$: Observable<boolean> = combineLatest([this.loginService.user$, this.isLarge$]).pipe(
    map(([user, large]) => !!user && large),
  );

  constructor(
    private loginService: LoginService,
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
  }

}
