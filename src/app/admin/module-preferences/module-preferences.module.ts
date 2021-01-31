import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreferencesCardComponent } from './preferences-card/preferences-card.component';
import { LibraryModule } from 'src/app/library/library.module';
import { ModulePreferencesComponent } from './module-preferences.component';
import { KastesPreferencesComponent } from './modules/kastes-preferences/kastes-preferences.component';
import { SystemPreferencesComponent } from './modules/system-preferences/system-preferences.component';
import { JobsPreferencesComponent } from './modules/jobs-preferences/jobs-preferences.component';
import { CategoryDialogComponent } from './modules/jobs-preferences/job-categories/category-dialog/category-dialog.component';
import { ModuleGroupComponent } from './module-group/module-group.component';
import { ColorSliderComponent } from './modules/kastes-preferences/color-slider/color-slider.component';
import { CardTitleDirective } from './card-title.directive';
import { JobCategoriesComponent } from './modules/jobs-preferences/job-categories/job-categories.component';



@NgModule({
  declarations: [
    PreferencesCardComponent,
    JobsPreferencesComponent,
    CategoryDialogComponent,
    ModuleGroupComponent,
    ModulePreferencesComponent,
    KastesPreferencesComponent,
    SystemPreferencesComponent,
    ColorSliderComponent,
    CardTitleDirective,
    JobCategoriesComponent,
  ],
  imports: [
    CommonModule,
    LibraryModule,
  ]
})
export class ModulePreferencesModule { }
