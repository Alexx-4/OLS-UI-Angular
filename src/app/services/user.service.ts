import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

import global from '../../../global.json'
import { AuthenticatedResponse, LoginViewModel } from '../models/LoginViewModel';
import { RegisterViewModel } from '../models/RegisterViewModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = global['serverURL'] + 'User/';

  constructor(private http: HttpClient,
              private jwtHelper: JwtHelperService) {
   }

   isUserAuthenticated = (): boolean => {
    const token = localStorage.getItem("jwt");
    if (token && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    return false;
  }

   loginUser(user:LoginViewModel):Observable<AuthenticatedResponse>{
    return this.http.post<AuthenticatedResponse>(this.url + 'Login', user);
  }

  registerUser(user: RegisterViewModel){
    return this.http.post<RegisterViewModel>(this.url + 'Register', user);
  }

  logoutUser(){
    return this.http.get(this.url + 'Logout');
  }

  getRoles(){
    return this.http.get(this.url + 'Roles');
  }

  getUsers(){
    return this.http.get(this.url + 'UserRoles');
  }

  updateUserRoles(user:any, roles:Array<string>){
    return this.http.put(this.url + 'updateRoles', {Id: user.id, RolsIds: roles});
  }

  deleteUser(user:{id:string}){
    return this.http.post<{id:string}>(this.url + 'deleteUser', {id:user.id});
  }
}
