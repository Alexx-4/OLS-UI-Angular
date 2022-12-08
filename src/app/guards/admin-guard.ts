import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

import global from '../../../global.json';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate  {

  constructor(private router:Router,
              private jwtHelper: JwtHelperService,
              private toastr: ToastrService,
              private userService: UserService){}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const token = localStorage.getItem("jwt");
    var user = this.userService.user;

    if (token && !this.jwtHelper.isTokenExpired(token) && user?.userRole === 'Admin'){
      return true;
    }

    if (token && this.jwtHelper.isTokenExpired(token)){
      this.toastr.warning('Please sign In again', 'Login sesion expired');
    }

    if (token && !this.jwtHelper.isTokenExpired(token) && user?.userRole !== 'Admin')
      this.toastr.warning('Not authorize');

    this.router.navigate([global['routeTitlePage']]);
    return false;
  }
}
