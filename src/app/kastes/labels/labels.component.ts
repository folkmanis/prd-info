import { Component, OnInit, ViewChild, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Kaste } from '../services/kastes.service';
import { TabulaComponent } from '../tabula/tabula.component';
import { PreferencesService, Preferences } from '../services/preferences.service';

@Component({
  selector: 'app-labels',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.css']
})
export class LabelsComponent implements OnInit {
  @ViewChild(TabulaComponent, { static: false }) tabula: TabulaComponent;
  statuss: Kaste;
  bridinajums = false;
  preferences: Preferences = {};
  inputForm = new FormGroup({
    kods: new FormControl(''),
  });

  constructor(
    private preferencesService: PreferencesService,
  ) { }

  ngOnInit() {
    this.preferencesService.getPreferences().subscribe((prefs) => {
      this.preferences = prefs;
    });
  }

  submitForm() {
    if (!this.inputForm.value.kods) { return; }
    this.updateData(this.inputForm.value.kods);
    this.inputForm.reset();
  }
  updateData(nr: number): void {
    this.tabula.setLabel(nr).subscribe((kaste) => this.changeStatus(kaste));
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
