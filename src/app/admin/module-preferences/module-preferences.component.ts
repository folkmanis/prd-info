import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, zip, of } from 'rxjs';
import { CanComponentDeactivate } from 'src/app/library/guards/can-deactivate.guard';
import { PreferencesDirective } from './preferences-component.class';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { map, tap, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-module-preferences',
  templateUrl: './module-preferences.component.html',
  styleUrls: ['./module-preferences.component.scss']
})
export class ModulePreferencesComponent implements OnInit, CanComponentDeactivate {
  @ViewChild('system') private system: PreferencesDirective;
  @ViewChild('kastes') private kastes: PreferencesDirective;
  @ViewChild('jobs') private jobs: PreferencesDirective;

  @ViewChildren(PreferencesDirective) components: QueryList<PreferencesDirective>;

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
    this.components.forEach(comp => comp.onSave());
    // this.kastes.onSave();
    // this.system.onSave();
    // this.jobs.onSave();
  }

  onResetAll() {
    console.log(this.components);
    this.components.forEach(comp => comp.onReset);
    // this.kastes.onReset();
    // this.system.onReset();
    // this.jobs.onReset();
  }

}
