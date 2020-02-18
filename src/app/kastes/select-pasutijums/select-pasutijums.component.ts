import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PasutijumiService } from '../services/pasutijumi.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { switchMap, distinctUntilChanged, map, tap, skip, take } from 'rxjs/operators';

@Component({
  selector: 'app-select-pasutijums',
  templateUrl: './select-pasutijums.component.html',
  styleUrls: ['./select-pasutijums.component.css']
})
export class SelectPasutijumsComponent implements OnInit {


  constructor(
    private pasutijumiService: PasutijumiService,
    private kastesPreferencesService: KastesPreferencesService,
    private router: Router,
    ) { }
  pasControl = new FormControl();
  pasutijumi$ = this.pasutijumiService.pasutijumi.pipe(
    map(pas => pas.filter(p => !p.deleted)) // Dzēstos nerāda
  );

  ngOnInit() {
    this.kastesPreferencesService.preferences.pipe(
      take(1),
    ).subscribe(pref => this.pasControl.setValue(pref.pasutijums));
    this.pasControl.valueChanges.pipe(
      skip(1),
      distinctUntilChanged(),
      switchMap(val => this.pasutijumiService.setPasutijums(val as string)),
      tap(()=> this.router.navigate(['kastes','selector',0])),
    ).subscribe();
  }

}
