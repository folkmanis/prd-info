import { Component, OnInit } from '@angular/core';
import { KastesService } from '../services/kastes.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map, tap, startWith, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-selector',
  templateUrl: './selector.component.html',
  styleUrls: ['./selector.component.css']
})
export class SelectorComponent implements OnInit {
  kastes: number[] = [];
  selected: number;
  loaded = false;
  constructor(
    private kastesService: KastesService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      tap((params) => this.selected = +params.get('id')),
      switchMap(() => this.kastesService.getTotals()),
      map((tot) => {
        tot.unshift(0); // Pirmais apjoms ir '0'
        return tot;
      })
    )
      .subscribe((kastes) => {
        this.kastes = kastes;
        this.loaded = true;
      });
  }
}
