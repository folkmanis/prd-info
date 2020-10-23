import { Component, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { filter, map } from 'rxjs/operators';
import { KastesJobPartial } from 'src/app/interfaces';

@Component({
  selector: 'app-select-pasutijums',
  templateUrl: './select-pasutijums.component.html',
  styleUrls: ['./select-pasutijums.component.scss']
})
export class SelectPasutijumsComponent {
  pasControl = new FormControl();

  @Input() pasutijumi: KastesJobPartial[];
  @Input() set pasutijums(pasutijums: number) {
    this.pasControl.setValue(pasutijums, { emitEvent: false });
  }
  @Output() pasuitjumsChanges = this.pasControl.valueChanges.pipe(
    map(val => +val),
    filter(val => !isNaN(val)),
  );

  constructor() {
  }

}
