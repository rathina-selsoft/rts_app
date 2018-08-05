import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoggedUserService } from '../Services/logged-user.service';
import { UserService } from '../Services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css'],
  providers: [LoggedUserService]
})
export class AddUserComponent implements OnInit {

  private userType: any;
  private rtsUser: any;
  private rtsUserId: any;

  public myForm: FormGroup;
  constructor(
    private loggedUser: LoggedUserService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userType = [
      { 'name': 'Account Manager', 'value': 'ACC_MGR' },
      { 'name': 'Team Leader', 'value': 'TL' },
      { 'name': 'Recruiter', 'value': 'RECRUITER' },
    ];
    this.rtsUser = JSON.parse(this.loggedUser.loggedUser);
    this.rtsUserId = this.rtsUser.userId;
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      firstName: [''],
      lastName: [''],
      email: ['', Validators.email],
      role: [''],
      userPassword: [''],
      confirmPassword: ['']
    });
  }

  addNewUser(form: FormGroup) {

    if (form.value.userPassword !== form.value.confirmPassword) {
      this.toastr.error('Password and confirmPassword does not match', '', {
        positionClass: 'toast-top-center',
        timeOut: 3000,
      });
      return false;
    }

    const user = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      role: form.value.role,
      password: form.value.userPassword,
      enteredBy: this.rtsUserId
    };

    this.userService.addUser(user)
      .subscribe(
        data => {
          if (data.success) {
            this.toastr.success('New User successfully added', '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
            this.router.navigate(['manage-users']);

          } else {
            this.toastr.error(data.message, '', {
              positionClass: 'toast-top-center',
              timeOut: 3000,
            });
          }
        });

  }

}
