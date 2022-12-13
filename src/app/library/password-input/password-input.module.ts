import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';

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
