import { Component, OnInit, OnDestroy } from '@angular/core';
import { KastesPreferencesService } from '../../services/kastes-preferences.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, pipe, Subscription } from 'rxjs';
import { map, tap, filter, switchMap, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { KastesTabulaService } from '../services/kastes-tabula.service';
import { DestroyService } from 'src/app/library/rx/destroy.service';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css'],
  providers: [DestroyService],
})
export class SelectorComponent implements OnInit {
  selected: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private preferencesService: KastesPreferencesService,
    private tabulaService: KastesTabulaService,
    private destroy$: DestroyService,
  ) { }

  usrPref$ = this.preferencesService.kastesUserPreferences$;

  apjomi$: Observable<number[]> = this.tabulaService.apjomi$.pipe(
    map(apj => [0, ...apj]),
  );

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => +params.get('apjoms')),
      tap(apjoms => this.selected = apjoms),
      takeUntil(this.destroy$),
    )
      .subscribe(this.tabulaService.apjoms$);

    this.tabulaService.pasutijumsId$.pipe(
      takeUntil(this.destroy$),
    ).subscribe(
      () => this.router.navigate(['../0'], { relativeTo: this.route })
    );
  }

}
