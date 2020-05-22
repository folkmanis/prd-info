import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { tap, map, takeUntil, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModulePreferencesService } from '../../services/module-preferences.service';
import { PreferencesComponent } from '../preferences-component.class';
import { cloneDeep } from 'lodash';
import { JobsSettings, AppParams } from 'src/app/interfaces';
import { APP_PARAMS } from 'src/app/app-params';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.css']
})
export class JobsPreferencesComponent implements OnInit, PreferencesComponent, OnDestroy {

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private moduleService: ModulePreferencesService,
    private dialog: MatDialog,
  ) { }

  pristine = true;
  private _subs = new Subscription();
  private oldSettings: JobsSettings;
  newSettings: JobsSettings;

  ngOnInit(): void {
    const subs = this.moduleService.getModulePreferences<JobsSettings>('jobs')
      .subscribe(sett => {
        this.oldSettings = cloneDeep(sett);
        this.newSettings = cloneDeep(sett);
      });
    this._subs.add(subs);
  }

  ngOnDestroy(): void {
    this._subs.unsubscribe();
  }

  canDeactivate(): Observable<boolean> {
    return of(this.pristine);
  }

  newCategory(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent);
    dialogRef.afterClosed().pipe(
      filter(cat => cat),
      tap(() => this.pristine = false),
    ).subscribe(cat => this.newSettings.productCategories.push(cat));
  }

  onSave(): void {
    this.moduleService.updateModulePreferences('jobs', this.newSettings);
    this.pristine = true;
  }

  onReset(): void {
    this.newSettings = cloneDeep(this.oldSettings);
    this.pristine = true;
  }

}
