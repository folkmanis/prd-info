import { Component, OnInit } from '@angular/core';
import { KastesService } from '../services/kastes.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map, tap, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  selected: number;
  apjomsSet = false;

  constructor(
    private kastesService: KastesService,
    private route: ActivatedRoute,
    private router: Router,
    private preferencesService: KastesPreferencesService,
  ) { }

  kastes$ = this.route.paramMap.pipe(
    switchMap(() => this.kastesService.volumes$),
    map(vol => [0, ...vol]),
  );

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => +params.get('id')),
      tap(apjoms => this.selected = apjoms),
      tap(apjoms => this.kastesService.apjoms = apjoms),
      tap(() => this.apjomsSet = true)
    ).subscribe();
  }

}
