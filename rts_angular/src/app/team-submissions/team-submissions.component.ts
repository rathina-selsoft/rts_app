import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { Router } from '@angular/router';
import { ClientService } from '../Services/client.service';
import { ActivatedRoute, Params } from '@angular/router';
import * as _ from 'underscore';
import { SubmissionService } from '../Services/submission.service';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-team-submissions',
  templateUrl: './team-submissions.component.html',
  styleUrls: ['./team-submissions.component.css'],
  providers: [LoggedUserService]
})
export class TeamSubmissionsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  private teamId: any;
  private submissionsLength: any;
  private submissionDetails: any;
  private teamDetails: any;
  private teamName: string;
  private filteredRequirements: any;
  private fromDate: any;
  private toDate: any;

  constructor(
    private loggedUser: LoggedUserService,
    private activatedRoute: ActivatedRoute,
    private submissionService: SubmissionService,
    private ngProgress: NgProgress
  ) {
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.ngProgress.start();
    this.activatedRoute.params
      .subscribe((params: Params) => {
        this.teamId = params['id'];
        this.fromDate = params['fromDate'];
        this.toDate = params['toDate'];
      });
    this.getTeamSubmission();
  }

  getTeamSubmission() {
    const userId = {
      teamId: this.teamId,
      fromDate: this.fromDate,
      toDate: this.toDate
    };

    this.submissionService.getTeamSubmissions(userId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.submissionDetails = data.requirements;
            this.filteredRequirements = this.submissionDetails;
            this.teamDetails = data.team;
            this.teamName = this.teamDetails.name;
            this.submissionsLength = this.submissionDetails.length;

          }
        });
  }

  filterItem(value) {
    this.submissionDetails = [];
    const filteredItems = Object.assign([], this.filteredRequirements).filter(
      item => item.position.positionName.toLowerCase().indexOf(value.toLowerCase()) > -1
    );
    this.submissionDetails = filteredItems;
  }

}
