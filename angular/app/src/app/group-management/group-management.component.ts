import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../services/group.service';
import {Group} from '../model/group.model';
import {stringify} from 'querystring';
import {GroupManagementService} from '../services/group-management.service';
import {AuthUser} from '../model/authUser.model';
import {Subscription} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {take, tap} from 'rxjs/operators';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit, OnDestroy {
  @ViewChild('updateGroupForm') updateForm: NgForm;
  constructor(private groupService: GroupService,
              private groupManagementService: GroupManagementService,
              private authService: AuthService) { }

  groups = [];
  teamLeaders = [];
  teamLeadersUpdate = [];
  deputies = [];
  deputiesUpdate = [];
  unAssignedUsers = [];
  selectedGroup: Group;

  sourceUsers = [''];
  targetUsers = [''];
  //////////////////////////////////////

  eventSubscription: Subscription;

  ngOnInit() {
    this.onInit();
    this.eventSubscription = this.groupManagementService.resetEvent.subscribe(change => {
      this.onInit();
    });
  }

  // TODO handle when an error happens
  onUpdate(form: NgForm) {
    console.log(form.value);
    if (this.selectedGroup) {
      this.selectedGroup.members = this.targetUsers.map(e => ({username: e}));
      this.selectedGroup.deputies = form.value.selectedDeputies.map(e => ({username: e}));
      console.log(form.value.selectedTeamLeader);
      this.selectedGroup.teamLeader = form.value.selectedTeamLeader == null ? null : {username: form.value.selectedTeamLeader};
      console.log(this.selectedGroup);
      this.groupService.updateGroup(this.selectedGroup).subscribe(resData => {
        console.log(resData);
        form.form.reset();
        this.onInit();
      });
    }
  }

  groupSelection(event: any) {
    this.groupService.getGroup(event.value).subscribe(resData => {
      this.selectedGroup = resData.body;
      this.teamLeadersUpdate = [];
      this.teamLeadersUpdate = this.teamLeadersUpdate.concat(this.teamLeaders);
      this.deputiesUpdate = [];
      this.deputiesUpdate = this.deputiesUpdate.concat(this.deputies);
      for (const item of this.selectedGroup.members) {
        this.deputiesUpdate.push({label: item.username, value: item.username});
      }
      for (const item of this.selectedGroup.deputies) {
        this.deputiesUpdate.push({label: item.username, value: item.username});
      }
      this.deputiesUpdate = this.deputiesUpdate.filter((element, index, arr) => arr.map(e => e.value).indexOf(element.value) === index);
      if (this.selectedGroup.teamLeader) {
        this.teamLeadersUpdate.push({label: this.selectedGroup.teamLeader.username, value: this.selectedGroup.teamLeader.username});
        this.deputiesUpdate = this.deputiesUpdate.filter((element, index, array) =>
          element.value !== this.selectedGroup.teamLeader.username);
      }
      this.updateForm.form.patchValue({
        selectedTeamLeader: this.selectedGroup.teamLeader == null ? '' : this.selectedGroup.teamLeader.username,
        selectedDeputies: this.selectedGroup.deputies.map(e => e.username),
      });
      this.targetUsers = this.selectedGroup.members.map(e => e.username);
    });
    this.sourceUsers = [];
    this.sourceUsers = this.sourceUsers.concat(this.unAssignedUsers);
  }

  private onInit() {
    this.sourceUsers = [''];
    this.targetUsers = [''];
    this.deputiesUpdate = [];
    this.teamLeadersUpdate = [];
    this.groups = [];
    if (this.authService.user.getValue().roles.includes('ADMIN')) {
        console.log('admin');
        this.groupService.getGroups().subscribe(resData => {
          for (const item of resData.body) {
            this.groups.push({label: item, value: item});
          }
          this.groupManagementService.groups.next(this.groups);
        });
      } else {
        console.log('nem ADMIN');
        this.groupService.getAvailableGroupsForUser(this.authService.user.getValue().username).subscribe(resData => {
          for (const item of resData.body) {
            this.groups.push({label: item, value: item});
          }
          this.groupManagementService.groups.next(this.groups);
        });
      }

    this.groupService.getUnassignedUsers().subscribe(resData => {
      this.unAssignedUsers = [];
      for (const item of resData.body) {
        this.unAssignedUsers.push(item);
      }
    });
    this.groupService.getAvailableTeamLeaders().subscribe(resData => {
      this.teamLeaders = [];
      for (const item of resData.body) {
        this.teamLeaders.push({label: item, value: item});
      }
      this.groupManagementService.teamLeaders.next(this.teamLeaders);
    });
    this.groupService.getTeamLeaders().subscribe(resData => {
      this.deputies = [];
      for (const item of resData.body) {
        this.deputies.push({label: item, value: item});
      }
    });
  }

  ngOnDestroy(): void {
    this.eventSubscription.unsubscribe();
  }

}
