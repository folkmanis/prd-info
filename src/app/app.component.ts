import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { LoginService } from './login/login.service';
import { User } from 'src/app/interfaces';
import { Observable, combineLatest, from } from 'rxjs';
import { map, shareReplay, tap, pluck } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { Store, select } from '@ngrx/store';
import * as loginSelectors from './selectors/login-selectors';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenavContent, { static: true }) content: MatSidenavContent;

  constructor(
    private loginService: LoginService,
    private breakpointObserver: BreakpointObserver,
    private zone: NgZone,
    private store: Store,
  ) { }
  // Lietotājs no servisa (lai būtu redzams templatē)
  user$: Observable<User> = this.store.select(loginSelectors.user);
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  // Vai atvērt sānu menu pie ielādes
  opened$: Observable<boolean> = combineLatest([this.user$, this.isHandset$]).pipe(
    map(([user, handset]) => !!user && !handset),
  );
  // Aktīvā moduļa nosaukums, ko rādīt toolbārā
  activeModule$ = this.loginService.activeModule$;
  // Lietotāja menu
  userMenu$: Observable<{ route: string[], text: string; }[]> = this.user$.pipe(
    map(usr => usr ? [{ route: ['/login'], text: 'Atslēgties' }] : [])
  );

  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.content.elementScrolled().pipe(
      map(() => this.content.measureScrollOffset('top')),
      tap(top => {
        if (top > this.showScrollHeight) {
          this.zone.run(() => this.showScroll = true); // Scroll tie pārbaudīts ārpus zonas. Bez run nekādas reakcijas nebūs
        } else if (this.showScroll && top < this.hideScrollHeight) {
          this.zone.run(() => this.showScroll = false);
        }
      }),
    ).subscribe();
  }

  scrollToTop() {
    this.content.scrollTo({ top: 0 });
  }

}
