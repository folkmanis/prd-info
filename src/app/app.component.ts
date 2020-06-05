import { Component, OnInit, AfterViewInit, ViewChild, NgZone, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { MatSidenavContent } from '@angular/material/sidenav';
import { User } from 'src/app/interfaces';
import { Observable, combineLatest, from, Subject } from 'rxjs';
import { map, shareReplay, tap, pluck } from 'rxjs/operators';
import { SystemPreferencesService, LoginService } from 'src/app/services';
import { ViewportRuler } from '@angular/cdk/scrolling';
import { LayoutService } from './layout/layout.service';

const panels = ['top', 'side'];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(MatSidenavContent, { static: true }) private content: MatSidenavContent;
  isHandset$: Observable<boolean> = this.layoutService.isHandset$;
  toolbarHeight$ = this.layoutService.toolbarHeight$;
  isSmall$ = this.layoutService.isSmall$;
  isMedium$ = this.layoutService.isMedium$;
  isLarge$ = this.layoutService.isLarge$;

  // Vai atvērt sānu menu pie ielādes
  opened$: Observable<boolean> = combineLatest([this.loginService.user$, this.isLarge$]).pipe(
    map(([user, large]) => !!user && large),
  );

  sideIsSet$: Observable<boolean>;

  showScroll = false;
  showScrollHeight = 300;
  hideScrollHeight = 10;

  constructor(
    private loginService: LoginService,
    private systemPreferencesService: SystemPreferencesService,
    private zone: NgZone,
    private viewport: ViewportRuler,
    private layoutService: LayoutService,
  ) { }

  ngOnInit() {
    this.layoutService.mainContainer = this.content;
  }

  ngAfterViewInit() {
  }

}
