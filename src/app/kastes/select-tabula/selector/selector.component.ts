import { Component, OnInit, OnDestroy } from '@angular/core';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, pipe, Subscription } from 'rxjs';
import { map, tap, filter, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { KastesTabulaService } from '../services/kastes-tabula.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit, OnDestroy {
  selected: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private preferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
  ) { }

  usrPref$ = this.preferencesService.kastesUserPreferences$;

  private readonly _subs = new Subscription();

  apjomi$: Observable<number[]> = this.tabulaService.apjomi$.pipe(
    map(apj => [0, ...apj]),
  );

  ngOnInit() {
    this._subs.add(
      this.route.paramMap.pipe(
        map(params => +params.get('apjoms')),
        tap(apjoms => this.selected = apjoms),
      )
        .subscribe(this.tabulaService.apjoms$)
    );

    this.tabulaService.pasutijumsId$.subscribe(
      () => this.router.navigate(['../0'], { relativeTo: this.route })
    );
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }
}
