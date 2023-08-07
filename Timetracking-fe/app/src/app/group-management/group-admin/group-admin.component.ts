import {Component, OnDestroy, OnInit} from '@angular/core';
import {NgForm} from '@angular/forms';
import {GroupService} from '../../services/group.service';
import {GroupManagementService} from '../../services/group-management.service';
import {Subscription} from 'rxjs';
import {MessageService} from 'primeng';
import {Message} from '../../model/message.model';

@Component({
  selector: 'app-group-admin',
  templateUrl: './group-admin.component.html',
  styleUrls: ['./group-admin.component.css']
})
export class GroupAdminComponent implements OnInit, OnDestroy {

  constructor(private groupService: GroupService,
              private groupManagementService: GroupManagementService,
              private messagingService: MessageService) { }

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

  onCreate(form: NgForm) {
    if (form.valid) {
      this.groupService.createGroup(form.value.groupName, form.value.selectedTeamLeader).subscribe(resData => {
        this.groupManagementService.resetEvent.next(true);
        form.reset();
        this.messagingService.add(new Message(
          'success',
          'New group successfully created!',
          ''));
      });
    } else {
      this.messagingService.add(new Message(
        'error',
        'Form is not valid!',
        ''));
    }
  }

  onDelete(form: NgForm) {
    if (form.valid) {
      this.groupService.deleteGroup(form.value.groupName).subscribe(resData => {
        this.groupManagementService.resetEvent.next(true);
        form.reset();
        this.messagingService.add(new Message(
          'success',
          'Group is deleted!',
          ''));
      });
    } else {
      this.messagingService.add(new Message(
        'error',
        'Form is not valid!',
        ''));
    }
  }

  ngOnDestroy(): void {
    this.groupSubscription.unsubscribe();
    this.teamLeaderSubscription.unsubscribe();
  }

}
