import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PasutijumiService } from '../services/pasutijumi.service';
import { KastesPreferencesService } from '../services/kastes-preferences.service';
import { switchMap, distinctUntilChanged, tap } from 'rxjs/operators';

@Component({
  selector: 'app-select-pasutijums',
  templateUrl: './select-pasutijums.component.html',
  styleUrls: ['./select-pasutijums.component.css']
})
export class SelectPasutijumsComponent implements OnInit {


  constructor(
    private pasutijumiService: PasutijumiService,
    private kastesPreferencesService: KastesPreferencesService,
  ) { }
  pasControl = new FormControl();
  pasutijumi$ = this.pasutijumiService.pasutijumi;

  ngOnInit() {
    this.kastesPreferencesService.preferences.subscribe(pref => this.pasControl.setValue(pref.pasutijums));
    this.pasControl.valueChanges.pipe(
      distinctUntilChanged(),
      tap(pasutijums => console.log(pasutijums)),
      switchMap(val => this.pasutijumiService.setPasutijums(val as string))
    ).subscribe();
  }

  setPasutijums(id: string) {
    this.pasutijumiService.setPasutijums(id);
  }

}
