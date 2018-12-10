import { Component, OnInit } from '@angular/core';
import { LoggedUserService } from '../Services/logged-user.service';
import { HideComponentService } from '../Services/hide-component.service';
import { SubmissionService } from '../Services/submission.service';
import { Sort } from '@angular/material';
import { NgProgress } from 'ngx-progressbar';

@Component({
  selector: 'app-in-progress-interviews',
  templateUrl: './in-progress-interviews.component.html',
  styleUrls: ['./in-progress-interviews.component.css'],
  providers: [LoggedUserService]
})
export class InProgressInterviewsComponent implements OnInit {

  private rtsUser: any;
  private rtsUserId: any;
  selectedInterviews: any[];
  interviewReport: any[];
  sortedData: any[];
  interviewsLength: any;

  constructor(
    private loggedUser: LoggedUserService,
    private submissonService: SubmissionService,
    private hideComponent: HideComponentService,
    private ngProgress: NgProgress
  ) {
    this.hideComponent.displayComponent = true;
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
    this.interviewReport = [];
    this.selectedInterviews = [];
  }

  ngOnInit() {
    this.ngProgress.start();
    this.getAllInprogressInterviews();
  }

  getAllInprogressInterviews() {
    const companyId = {
      userId: this.rtsUserId
    };

    this.submissonService.GetAllProgressInterviews(companyId)
      .subscribe(
        data => {
          if (data.success) {
            this.ngProgress.done();
            this.selectedInterviews = data.submissionReport;
            this.interviewsLength = this.selectedInterviews.length;
            this.sortedData = this.selectedInterviews.slice();
          }
        });
  }

  sortData(sort: Sort) {
    const data = this.selectedInterviews.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'positionName': return this.compare(a.positionName, b.positionName, isAsc);
        case 'candidateName': return this.compare(a.candidateName, b.candidateName, isAsc);
        case 'clientName': return this.compare(a.clientName, b.clientName, isAsc);
        case 'InterviewDateTime': return this.compare(a.interviewDateStr, b.interviewDateStr, isAsc);
        case 'InterviewLevel': return this.compare(a.interviewLevel, b.interviewLevel, isAsc);
        case 'recruiterName': return this.compare(a.recruiterName, b.recruiterName, isAsc);
        case 'skype': return this.compare(a.skypeId, b.skypeId, isAsc);
        case 'phoneNumber': return this.compare(a.phoneNumber, b.phoneNumber, isAsc);
        case 'currentStatus': return this.compare(a.currentStatus, b.currentStatus, isAsc);
        case 'interviewStatus': return this.compare(a.interviewDetailStatus, b.interviewDetailStatus, isAsc);
        default: return 0;
      }
    });
  }

  compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}