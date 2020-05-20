import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PasutijumiService } from '../services/pasutijumi.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { switchMap, distinctUntilChanged, map, tap, skip, take, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-pasutijums',
  templateUrl: './select-pasutijums.component.html',
  styleUrls: ['./select-pasutijums.component.css']
})
export class SelectPasutijumsComponent implements OnInit, OnDestroy {


  constructor(
    private pasutijumiService: PasutijumiService,
    private kastesPreferencesService: KastesPreferencesService,
    private router: Router,
  ) { }
  pasControl = new FormControl();
  pasutijumi$ = this.pasutijumiService.pasutijumi.pipe(
    map(pas => pas.filter(p => !p.deleted)) // Dzēstos nerāda
  );
  private subs: Subscription;

  ngOnInit() {
    // Sākotnējā vērtība
    this.kastesPreferencesService.preferences.pipe(
      take(1), // Nevajag atrakstīties
      map(pref => pref.pasutijums),
    ).subscribe(pas => this.pasControl.setValue(pas, { emitEvent: false }));
    // Mainās pasūtījums
    this.subs = this.pasControl.valueChanges.pipe(
      switchMap(val => this.pasutijumiService.setPasutijums(val as string)),
      tap(() => this.router.navigate(['kastes', 'selector', 0])),
    ).subscribe();
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

}
