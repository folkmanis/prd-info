import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, zip, of } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { PreferencesComponent } from './preferences-component.class';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.css']
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('system') private system: PreferencesComponent;
  @ViewChild('kastes') private kastes: PreferencesComponent;
  @ViewChild('jobs') private jobs: PreferencesComponent;

  constructor(
    private dialogService: ConfirmationDialogService,
  ) { }

  ngOnInit() {
  }

  canDeactivate(): boolean | Observable<boolean> {
    return zip(this.kastes.canDeactivate(), this.system.canDeactivate())
      .pipe(
        map(result => result.reduce((acc, curr) => acc && curr, true)),
        switchMap(result => result ? of(true) : this.dialogService.discardChanges()),
      );
  }

  onSaveAll() {
    this.kastes.onSave();
    this.system.onSave();
    this.jobs.onSave();
  }

  onResetAll() {
    this.kastes.onReset();
    this.system.onReset();
    this.jobs.onReset();
  }

}
