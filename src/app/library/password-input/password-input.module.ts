import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PasswordInputDirective } from './password-input.directive';
import { PasswordInputDialogComponent } from './password-input-dialog/password-input-dialog.component';
import { PasswordInputGroupComponent } from './password-input-group/password-input-group.component';

import { A11yModule } from '@angular/cdk/a11y';




@NgModule({
  declarations: [
    PasswordInputDirective,
    PasswordInputDialogComponent,
    PasswordInputGroupComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    A11yModule,
  ],
  exports: [
    PasswordInputDirective,
    PasswordInputGroupComponent,
  ]
})
export class PasswordInputModule { }
