import { Component, OnInit } from '@angular/core';
import { KastesService } from '../services/kastes.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  selected: number;
  loaded = false;

  constructor(
    private kastesService: KastesService,
    private route: ActivatedRoute
  ) { }

  kastes$ = this.route.paramMap.pipe(
    tap((params) => this.selected = +params.get('id')),
    switchMap(() => this.kastesService.getTotals()),
    map(tot => [0, ...tot]),
    tap(() => this.loaded = true)
  );

  ngOnInit() {
  }
}
