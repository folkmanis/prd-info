import { Component, OnInit, AfterViewInit, ViewChild, NgZone } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { LoginService, User } from './login/login.service';
import { Observable, combineLatest, from } from 'rxjs';
import { map, shareReplay, tap, pluck } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenavContent) content: MatSidenavContent;
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
    private zone: NgZone,
  ) { }

  ngOnInit() {
  }

  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;

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
    console.log('scroll', this.content)
    this.content.scrollTo({ top: 0 });
  }

}
