import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { User } from 'src/app/interfaces';
import { Observable, combineLatest, from } from 'rxjs';
import { map, shareReplay, tap, pluck } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SystemPreferencesService, LoginService } from 'src/app/services';
import { ViewportRuler } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenavContent, { static: true }) private content: MatSidenavContent;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
  // Vai atvērt sānu menu pie ielādes
  opened$: Observable<boolean> = combineLatest([this.loginService.user$, this.isHandset$]).pipe(
    map(([user, handset]) => !!user && !handset),
  );
  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
    private breakpointObserver: BreakpointObserver,
    private zone: NgZone,
    private viewport: ViewportRuler,
  ) { }

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
