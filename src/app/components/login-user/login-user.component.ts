import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginViewModel } from 'src/app/models/LoginViewModel';
import { UserService } from 'src/app/services/user.service';
import global from '../../../../global.json'

@Component({
  selector: 'app-login-user',
  templateUrl: './login-user.component.html',
  styleUrls: ['./login-user.component.css']
})
export class LoginUserComponent implements OnInit {

  UserForm:FormGroup;

  constructor(private UserService:UserService,
              private formBuilder:FormBuilder,
              private router: Router) {

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

    console.log(user);

    this.UserService.loginUser(user).subscribe({
      next: (data) =>{
        console.log(data);
        console.log("Usuario Logeado");
      },
      error: (err) => {
        console.log(err);
        console.log("Error. Usuario no registrado en el sistema");
      }
    });
  }

  logoutUser(){
    this.UserService.logoutUser().subscribe({
      next: (data) =>{
        console.log(data);
        console.log('Usuario deslogeado');
       },
      error: (err) => {
        console.log('Error deslogeando');
      }
    });
  }

  getAtrr(atrrName:string){
    return this.UserForm.get(atrrName);
  }

  goRegister(){
    this.router.navigate([global['routeRegister']]);
  }

}
