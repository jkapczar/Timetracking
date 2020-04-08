import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../../services/group.service';
import {GroupManagementService} from '../../services/group-management.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.css']
})
export class GroupAdminComponent implements OnInit, OnDestroy {

  constructor(private groupService: GroupService,
              private groupManagementService: GroupManagementService) { }

  groups;
  teamLeaders;

  groupSubscription: Subscription;
  teamLeaderSubscription: Subscription;

  ngOnInit(): void {
    this.groupSubscription = this.groupManagementService.groups.subscribe(groups => {
      this.groups = groups;
    });
    this.teamLeaderSubscription = this.groupManagementService.teamLeaders.subscribe(teamLeaders => {
      this.teamLeaders = teamLeaders;
    });
  }

  // TODO reset (there will be a new group! sub inside sub?)
  onCreate(form: NgForm) {
    console.log('create group');
    console.log(form.value);
    console.log(form.valid);
    if (form.valid) {
      this.groupService.createGroup(form.value.groupName, form.value.selectedTeamLeader).subscribe(resData => {
        console.log(resData);
      });
    } else {
      console.log('invalid form');
    }
  }

  // TODO reset
  onDelete(form: NgForm) {
    console.log('delete');
    console.log(form.value);
    if (form.valid) {
      this.groupService.deleteGroup(form.value.groupName).subscribe(resData => {
        console.log(resData);
        // this.onReInit();
      });
    } else {
      console.log('invalid form');
    }
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
    this.teamLeaderSubscription.unsubscribe();
  }

}
