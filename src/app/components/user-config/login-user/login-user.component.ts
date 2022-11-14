import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticatedResponse, LoginViewModel } from 'src/app/models/LoginViewModel';
import { UserService } from 'src/app/services/user.service';
import global from '../../../../../global.json'

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  UserForm:FormGroup;

  constructor(formBuilder:FormBuilder,
              private UserService:UserService,
              private router: Router,
              private toastr:ToastrService) {

      this.UserForm = formBuilder.group({
        id:0,
        Username: ['', [Validators.required, Validators.email]],
        Password:['', [Validators.required]],
        RememberMe:[false, [Validators.required]]
      })
               }

  ngOnInit(): void {

  }

  loginUser(){
    const user:LoginViewModel = {
      Username: this.UserForm.get('Username')?.value,
      Password: this.UserForm.get('Password')?.value,
      RememberMe: this.UserForm.get('RememberMe')?.value

    };

    this.UserService.loginUser(user).subscribe({
      next: (response: AuthenticatedResponse) => {
        const token = response.token;
        localStorage.setItem("jwt", token);
      },
      error: (err) => {
        console.log(err);
        this.toastr.info('User not registered, please create an account');
      }
    });
  }

  logoutUser(){
    this.UserService.logoutUser().subscribe(
      ()=>{
        localStorage.removeItem("jwt");
      }
    );
  }

  getAtrr(atrrName:string){
    return this.UserForm.get(atrrName);
  }

  goRegister(){
    this.router.navigate([global['routeRegister']]);
  }

}
