import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import global from '../../../global.json'
import { LoginViewModel } from '../models/LoginViewModel';
import { RegisterViewModel } from '../models/RegisterViewModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url:string = global['serverURL'] + 'User/';

  constructor(private http: HttpClient) {
   }

   loginUser(user:LoginViewModel):Observable<LoginViewModel>{
    return this.http.post<LoginViewModel>(this.url + 'Login', user);
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
