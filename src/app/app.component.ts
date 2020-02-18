import { Component, OnInit } from '@angular/core';
import { LoginService, User } from './login/login.service';
import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  //Lietotājs no servisa (lai būtu redzams templatē)
  user$: Observable<User> = this.loginService.user$;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  // Vai atvērt sānu menu pie ielādes
  opened$: Observable<boolean> = combineLatest(this.loginService.user$, this.isHandset$).pipe(
    map(([user, handset]) => !!user && !handset),
  );
  // Aktīvā moduļa nosaukums, ko rādīt toolbārā
  activeModule$ = this.loginService.activeModule$;
  // Lietotāja menu
  userMenu$: Observable<{ route: string[], text: string; }[]> = this.loginService.user$.pipe(
    map(usr => usr ? [{ route: ['/login'], text: 'Atslēgties' }] : [])
  );

  constructor(
    private loginService: LoginService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  ngOnInit() {
  }

}
