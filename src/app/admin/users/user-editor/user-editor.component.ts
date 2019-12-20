import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { UsersService, Customer } from '../../services/users.service';
import { User } from '../../services/http.service';
import { debounceTime, distinctUntilChanged, switchMap, filter, tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { PasswordChangeDialogComponent } from "./password-change-dialog/password-change-dialog.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent implements OnInit {

  userForm = new FormGroup({
    name: new FormControl(),
    admin: new FormControl(),
    preferences: new FormGroup({
      customers: new FormControl(),
    }),
  });

  customers: Customer[];
  selectedUsername: string;
  user: User;
  valueChangesSubscription: Subscription;
  @Input('username') set username(_uname: string) {
    this.selectedUsername = _uname;
    this.usersService.getUser(this.selectedUsername).subscribe(usr => {
      this.user = usr;
      this.setFormValues(usr);
    });
  }

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.usersService.getCustomers().subscribe((cust) => this.customers = cust);
  }

  onDelete() {
    // TODO prompt dialog
    console.log('TODO delete user');
  }

  onPasswordChange() {
    const dialogRef = this.dialog.open(PasswordChangeDialogComponent, {
      width: '300px',
      data: { username: this.user.username },
    });
    dialogRef.afterClosed().pipe(
      filter(result => result),
      switchMap(result => this.usersService.updatePassword(this.user.username, result)),
    ).subscribe(resp => {
      if (resp) {
        this.snackBar.open(`Parole nomainita!`, 'OK', { duration: 3000 });
      }
    });
  }

  private setFormValues(usr: Partial<User> | null) {
    // Lai pie formas ielādes neveiktu saglabāšanas darbību
    // vajag atrakstīties no izmaiņu notikuma
    if (this.valueChangesSubscription) { this.valueChangesSubscription.unsubscribe(); }
    if (!usr) { return; }
    this.userForm.setValue({
      name: usr.name,
      admin: usr.admin,
      preferences: {
        customers: usr.preferences.customers,
      }
    });
    // Pēc tam jāpierakstās atpakaļ
    this.valueChangesSubscription = this.userForm.valueChanges.pipe(
      debounceTime(500),
      switchMap((form) => this.usersService.updateUser(this.user.username, form)),
    ).subscribe(result => {
      if (result) {
        this.userForm.markAsPristine();
      }
    });

  }

}
