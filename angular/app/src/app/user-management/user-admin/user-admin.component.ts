import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core';
import {User} from '../../model/user.model';
import {UserService} from '../../services/user.service';
import {NgForm} from '@angular/forms';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-user-admin-view',
  templateUrl: './user-admin.component.html',
  styleUrls: ['./user-admin.component.css']
})
export class UserAdminComponent implements OnInit {
  @ViewChild('selectionForm') selectionForm: NgForm;
  constructor(private userService: UserService,
              private authService: AuthService) { }

  users = [];
  selectedUser: string;
  @Output() selectedUserEmitter = new EventEmitter<string>();
  @Input() user: User;
  @Input() active = true;

  ngOnInit(): void {
    this.getAllUsers();
  }

  getAllUsers() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = [];
      for (const item of data.body) {
        this.users.push({label: item, value: item});
      }
      this.selectionForm.form.setValue({
        userSelection: this.user ? this.user.username : ''
      });
    });
  }

  onActivate() {
    console.log(this.selectedUser);
    this.authService.updateStatus(this.selectedUser).subscribe(resData => {
      console.log(resData);
      this.active = !this.active;
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
    this.selectedUserEmitter.emit(this.selectedUser);
  }

}
