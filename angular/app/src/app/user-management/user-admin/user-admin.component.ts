import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Creds} from '../../model/creds.model';
import {UserManagementService} from '../../services/user-management.service';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-user-admin-view',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit, OnDestroy {
  @ViewChild('selectionForm') selectionForm: NgForm;
  constructor(private userService: UserService,
              private authService: AuthService,
              private userManagementService: UserManagementService) { }

  users = [];
  selectedUser: string;
  credentials: Creds;
  admin = false;
  active = false;
  credentialsSubscription: Subscription;

  ngOnInit(): void {
    this.getAllUsers();
    this.credentialsSubscription = this.userManagementService.credentials.subscribe(credentials => {
      this.credentials = credentials;
      this.admin = credentials.admin;
      this.active = credentials.active;
    });
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = [];
      for (const item of data.body) {
        this.users.push({label: item, value: item});
      }
      this.selectionForm.form.patchValue({
        userSelection: this.authService.user.value.sub
      });
    });
  }

  onActivate() {
    this.authService.updateStatus(this.selectedUser).subscribe(resData => {
      console.log(resData);
      this.active = !this.active;
      this.credentials.admin = this.admin;
      this.credentials.active = this.active;
      this.userManagementService.credentials.next(this.credentials);
    });
  }

  onEnableAdmin() {
    this.authService.updateAdmin(this.selectedUser).subscribe(resData => {
      console.log(resData);
      this.admin = !this.admin;
      this.credentials.admin = this.admin;
      this.credentials.active = this.active;
      this.userManagementService.credentials.next(this.credentials);
    });
  }

  onDelete() {
    console.log('deleting ' + this.selectedUser);
    this.userService.deleteUser(this.selectedUser).subscribe(resData => {
      console.log(resData.status);
      this.users.splice(this.users.indexOf(this.selectedUser), 1);
      this.selectionForm.onReset();
    });
  }

  onSelect() {
    this.userManagementService.selectedUser.next(this.selectedUser);
  }

  ngOnDestroy(): void {
    this.credentialsSubscription.unsubscribe();
  }

}
