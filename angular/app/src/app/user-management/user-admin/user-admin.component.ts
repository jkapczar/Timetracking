import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {UserService} from '../../services/user.service';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Creds} from '../../model/creds.model';
import {UserManagementService} from '../../services/user-management.service';
import {Subscription} from 'rxjs';
import {Message} from '../../model/message.model';
import {MessageService} from 'primeng';


@Component({
  selector: 'app-user-admin-view',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit, OnDestroy {
  @ViewChild('selectionForm') selectionForm: NgForm;
  constructor(private userService: UserService,
              private authService: AuthService,
              private userManagementService: UserManagementService,
              private messagingService: MessageService) { }

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
        userSelection: this.authService.user.value.username
      });
    }, error => {
      this.messagingService.add(new Message(
        'error',
        'Service is down!',
        ''));
    });
  }

  onActivate() {
    this.authService.updateStatus(this.selectedUser).subscribe(resData => {
      this.setValues();
      this.userManagementService.credentials.next(this.credentials);
      this.messagingService.add(new Message(
        'success',
        'Update was successful!',
        ''));
    }, error => {
      this.messagingService.add(new Message(
        'error',
        'Activation failed!',
        ''));
    });
  }

  onEnableAdmin() {
    this.authService.updateAdmin(this.selectedUser).subscribe(resData => {
      this.setValues();
      this.userManagementService.credentials.next(this.credentials);
      this.messagingService.add(new Message(
        'success',
        'Update was successful!',
        ''));
    }, error => {
      this.messagingService.add(new Message(
        'error',
        'Update failed!',
        ''));
    });
  }

  onDelete() {
    this.userService.deleteUser(this.selectedUser).subscribe(resData => {
      this.users.splice(this.users.indexOf(this.selectedUser), 1);
      this.selectionForm.onReset();
    });
  }

  setValues() {
    this.admin = !this.admin;
    this.credentials.admin = this.admin;
    this.credentials.active = this.active;
  }

  onSelect() {
    this.userManagementService.selectedUser.next(this.selectedUser);
  }

  ngOnDestroy(): void {
    this.credentialsSubscription.unsubscribe();
  }

}
