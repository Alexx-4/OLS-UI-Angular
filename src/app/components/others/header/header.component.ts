import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { UserModel } from 'src/app/models/UserModel';
import { UserService } from 'src/app/services/user.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  routes = global;

  constructor(private userService: UserService,
              private spinner: NgxSpinnerService,
              private toastr: ToastrService,
              private router: Router) { }

  ngOnInit(): void {
  }

  get isUserAuthenticated(){
    return this.userService.isUserAuthenticated();
  }

  get user(){
    var _user = this.userService.user;
    return _user === undefined ? new UserModel() : _user;
  }

  get isAdmin(){
    return this.user !== undefined && this.user.userRole === 'Admin';
  }

  logoutUser(){
    this.spinner.show();
    this.userService.logoutUser().subscribe({
      next:()=>{
        localStorage.removeItem("jwt");
        this.toastr.info('User disconnected');
        this.router.navigate([global['routeTitlePage']]);
        this.spinner.hide();
      },
    error: ()=>{
      this.toastr.error('Error from server. Try again');
      this.spinner.hide();
    }}
    );
  }

  goHome(){
    this.spinner.show();
    this.router.navigate([global['routeTitlePage']]);
    this.spinner.hide();
  }

}
