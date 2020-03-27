import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService, Customer, UserModule } from '../../services/users.service';
import { User } from '../../services/admin-http.service';
import { debounceTime, distinctUntilChanged, switchMap, filter, tap, map } from 'rxjs/operators';
import { Subscription, Observable } from 'rxjs';
import { PasswordChangeDialogComponent } from "./password-change-dialog/password-change-dialog.component";
import { CanComponentDeactivate } from "../../../library/guards/can-deactivate.guard";
import { ConfirmationDialogService } from 'src/app/library/confirmation-dialog/confirmation-dialog.service';

@Component({
  selector: 'app-user-editor',
  templateUrl: './user-editor.component.html',
  styleUrls: ['./user-editor.component.css']
})
export class UserEditorComponent implements OnInit, CanComponentDeactivate {

  userForm = new FormGroup({
    name: new FormControl(),
    admin: new FormControl(),
    preferences: new FormGroup({
      customers: new FormControl(),
      modules: new FormControl(),
    }),
  });

  // customers: Customer[];
  selectedUsername: string;
  user: User;
  valueChangesSubscription: Subscription;
  userModules: UserModule[] = [];

  constructor(
    private usersService: UsersService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private dialogService: ConfirmationDialogService,
  ) {   }

  customers$: Observable<Customer[]> = this.usersService.customers$;

  ngOnInit() {
    // this.usersService.getCustomers().subscribe((cust) => this.customers = cust);
    this.route.paramMap.pipe(
      map((params: ParamMap) => params.get('id')),
      tap(usr => this.selectedUsername = usr),
      switchMap(username => this.usersService.getUser(username))
    ).subscribe(usr => {
      this.user = usr;
      this.setFormValues(this.user);
    });
    this.userModules = this.usersService.getUserModules();

  }

  onDelete() {
    this.dialogService.confirm('Tiešām dzēst lietotāju?').pipe(
      filter(resp => resp),
      switchMap(() => this.usersService.deleteUser(this.user.username)),
    ).subscribe(resp => {
      resp && this.snackBar.open(`Lietotājs ${this.user.username} likvidēts`, 'OK', { duration: 5000 });
      this.router.navigate(['admin', 'users']);
    });
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

  canDeactivate(): Observable<boolean> | boolean {
    if(this.userForm.pristine) {
      return true;
    }
      const data= {
        yes: 'Jā, pamest!',
        no: 'Nē, gaidīt!',
      }
    const prompt= 'Visas izmaiņas vēl nav saglabātas. Ja pametīsiet šo sadaļu, tad tās, iespējams, netiks saglabātas.';
    return this.dialogService.confirm(prompt,{data})
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
        modules: usr.preferences.modules || [],
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
