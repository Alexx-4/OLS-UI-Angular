import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterViewModel } from 'src/app/models/RegisterViewModel';
import { UserService } from 'src/app/services/user.service';
import { PasswordValidator } from 'src/app/validators/password.validator';
import global from '../../../../global.json'

@Component({
  selector: 'app-register-user',
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  RegisterForm:FormGroup;

  constructor(private UserService:UserService,
              private router: Router) {

        this.RegisterForm = new FormGroup({
          'Username': new FormControl('', [Validators.required,Validators.email]),
          'Password': new FormControl('',[Validators.required,
    Validators.minLength(8),
    Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)]),
          'ConfirmPassword': new FormControl('', Validators.required)
        }, { validators: PasswordValidator })

    }

  ngOnInit(): void {

  }

  registerUser(){
    var _user:RegisterViewModel = {
      Username: this.RegisterForm.get('Username')?.value,
      Password: this.RegisterForm.get('Password')?.value,
      ConfirmPassword: this.RegisterForm.get('ConfirmPassword')?.value
    };
    console.log(_user);
    this.UserService.registerUser(_user).subscribe({
      next: (data) =>{
        console.log(data);
        console.log('Usuario registrado');
       },
      error: (err) => {
        console.log('Usuario ya se encuentra registrado en el sistema');
      }
    });
  }
  getAtrr(atrr:string){
    return this.RegisterForm.get(atrr);
  }

  goLogin(){
    this.router.navigate([global['routeLogin']]);
  }
}
