import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ModulePreferencesService } from '../../services/module-preferences.service';
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';
import { JobsSettings, DEFAULT_SYSTEM_PREFERENCES } from 'src/app/library/classes/system-preferences-class';
import { Observable, of, Subject } from 'rxjs';
import { PreferencesComponent } from '../preferences-component.class';
import { LoginService } from 'src/app/login/login.service';
import { tap, map, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-jobs-preferences',
  templateUrl: './jobs-preferences.component.html',
  styleUrls: ['./jobs-preferences.component.css']
})
export class JobsPreferencesComponent implements OnInit, PreferencesComponent {

  constructor(
    private moduleService: ModulePreferencesService,
    private fb: FormBuilder,
    private loginService: LoginService
  ) { }

  private unsub = new Subject<void>();
  preferencesForm = this.fb.group({
    productCategories: [''],
  });
  settings: JobsSettings;
  productCategories: Array<{ category: string, description: string; }>;

  get catContr(): AbstractControl {
    return this.preferencesForm.get('productCategories');
  }

  categories$ = this.moduleService.getModulePreferences<JobsSettings>('jobs').pipe(
    map(sett => sett.productCategories ||  (DEFAULT_SYSTEM_PREFERENCES.get('jobs') as JobsSettings).productCategories),
    tap(cat => this.productCategories = cat),
    tap(console.log),
  );

  ngOnInit(): void {
    this.categories$.pipe(takeUntil(this.unsub)).subscribe();
  }

  canDeactivate(): Observable<boolean> {
    return of(true);
  }

  onSave(): void {
    const sett: JobsSettings = { productCategories: this.productCategories };
    console.log(sett);
    this.moduleService.updateModulePreferences('jobs', sett).subscribe();
    return;
  }

  onReset(): void {
    return;
  }

}
