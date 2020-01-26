import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Kaste } from '../services/kastes.service';
import { TabulaComponent } from '../tabula/tabula.component';
import { filter, switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  @ViewChild(TabulaComponent, { static: false }) tabula: TabulaComponent;
  statuss: Kaste;
  bridinajums = false;
  locked = false;
  preferences = { yellow: 'yellow', rose: 'red', white: 'gray' };
  inputForm = new FormGroup({
    kods: new FormControl(''),
  });

  constructor(
  ) { }

  ngOnInit() {
  }

  onSubmit() {
    const kods = this.inputForm.get('kods');
    if (+kods.value !== NaN) {
      this.locked = true;
      this.tabula.setLabel(+kods.value).pipe(
        tap(kaste => this.changeStatus(kaste)),
      ).subscribe(() => this.locked = false);
    }
    this.inputForm.reset();
  }

  private changeStatus(ev: Kaste | null) {
    if (ev) {
      this.statuss = ev;
      this.bridinajums = false;
    } else {
      this.statuss = null;
      this.bridinajums = true;
    }
  }
}
