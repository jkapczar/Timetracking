import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../services/group.service';
import {Group} from '../model/Group.model';
import {stringify} from 'querystring';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  @ViewChild('updateGroupForm') updateForm: NgForm;
  constructor(private groupService: GroupService) { }

  groups = [];
  teamLeaders = [{label: 'None', value: null}];
  teamLeadersUpdate = [];
  deputies = [];
  deputiesUpdate = [];
  unAssignedUsers = [];
  selectedGroup: Group;

  sourceUsers = [''];
  targetUsers = [''];
  //////////////////////////////////////


  ngOnInit() {
    this.groupService.getGroups().subscribe(resData => {
      for (const item of resData.body) {
        this.groups.push({label: item, value: item});
      }
    });
    this.onReInit();
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
        this.onReInit();
        form.form.reset();
      });
    }
  }

  onDelete(form: NgForm) {
    console.log('delete');
    console.log(form.value);
    if (form.valid) {
      this.groupService.deleteGroup(form.value.groupName).subscribe(resData => {
        console.log(resData);
      });
    } else {
      console.log('invalid form');
    }
    this.onReInit();
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

      // TODO we don't need map
      this.updateForm.form.patchValue({
        selectedTeamLeader: this.selectedGroup.teamLeader == null ? '' : this.selectedGroup.teamLeader.username,
        selectedDeputies: this.selectedGroup.deputies.map(e => e.username),
      });
      this.targetUsers = this.selectedGroup.members.map(e => e.username);
    });
    this.sourceUsers = [];
    this.sourceUsers = this.sourceUsers.concat(this.unAssignedUsers);
  }

  private onReInit() {
    this.sourceUsers = [''];
    this.targetUsers = [''];
    this.deputiesUpdate = [];
    this.teamLeadersUpdate = [];
    this.groupService.getUnassignedUsers().subscribe(resData => {
      this.unAssignedUsers = [];
      for (const item of resData.body) {
        this.unAssignedUsers.push(item);
      }
    });
    this.groupService.getAvailableTeamLeaders().subscribe(resData => {
      this.teamLeaders = [{label: 'None', value: null}];
      for (const item of resData.body) {
        this.teamLeaders.push({label: item, value: item});
      }
    });
    this.groupService.getTeamLeaders().subscribe(resData => {
      this.deputies = [];
      for (const item of resData.body) {
        this.deputies.push({label: item, value: item});
      }
    });
  }

}
