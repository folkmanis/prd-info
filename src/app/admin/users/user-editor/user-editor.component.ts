import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UsersService, Customer } from '../../services/users.service';
import { User } from '../../services/http.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

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
  ) { }

  ngOnInit() {
    this.usersService.getCustomers().subscribe((cust) => this.customers = cust);
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
