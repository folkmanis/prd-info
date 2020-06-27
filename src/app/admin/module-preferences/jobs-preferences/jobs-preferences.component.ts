import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { cloneDeep } from 'lodash';
import { Observable, of, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { APP_PARAMS } from 'src/app/app-params';
import { AppParams, JobsSettings } from 'src/app/interfaces';
import { SystemPreferencesService } from 'src/app/services';
import { PreferencesComponent } from '../preferences-component.class';
import { CategoryDialogComponent } from './category-dialog/category-dialog.component';

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.css']
})
export class JobsPreferencesComponent implements OnInit, PreferencesComponent, OnDestroy {

  constructor(
    @Inject(APP_PARAMS) private params: AppParams,
    private dialog: MatDialog,
    private systemPreferencesService: SystemPreferencesService,
  ) { }

  pristine = true;
  private _subs = new Subscription();
  private oldSettings: JobsSettings;
  newSettings: JobsSettings;

  ngOnInit(): void {
    const subs = this.systemPreferencesService.getModulePreferences<JobsSettings>('jobs')
      .subscribe(sett => {
        this.oldSettings = sett || this.params.defaultSystemPreferences.get('jobs') as JobsSettings;
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
    this.systemPreferencesService.updateModulePreferences('jobs', this.newSettings).pipe(
      tap(() => this.pristine = true),
    ).subscribe();
  }

  onReset(): void {
    this.newSettings = cloneDeep(this.oldSettings);
    this.pristine = true;
  }

}
