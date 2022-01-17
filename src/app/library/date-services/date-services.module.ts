import { NgModule, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Locale } from 'date-fns';
import { RelativeDatePipe } from './relative-date.pipe';


@NgModule({
  declarations: [
    RelativeDatePipe,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    RelativeDatePipe,
  ]
})
export class DateServicesModule { }
