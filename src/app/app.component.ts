import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { combineLatest, Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { StoreState, User, UserModule } from 'src/app/interfaces';
import * as selectors from './store/selectors';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenavContent, { static: true }) content: MatSidenavContent;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private zone: NgZone,
    private store: Store<StoreState>,
  ) { }
  // Lietotājs no servisa (lai būtu redzams templatē)
  user$: Observable<User> = this.store.select(selectors.user);
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
  activeModule$: Observable<UserModule> = this.store.select(selectors.selectSystem).pipe(
    map(state => state.activeModule)
  );
  // this.loginService.activeModule$;
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
