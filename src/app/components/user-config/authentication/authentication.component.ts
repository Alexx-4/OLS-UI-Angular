import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthenticatedResponse, LoginViewModel } from 'src/app/models/LoginViewModel';
import { RegisterViewModel } from 'src/app/models/RegisterViewModel';
import { UserService } from 'src/app/services/user.service';
import { PasswordValidator } from 'src/app/validators/password.validator';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  LoginForm:FormGroup;
  RegisterForm: FormGroup;

  constructor(formBuilder:FormBuilder,
              private UserService:UserService,
              private toastr:ToastrService,
              private spinner: NgxSpinnerService) {

      this.LoginForm = formBuilder.group({
          UsernameLogin: ['', [Validators.required]],
          PasswordLogin: ['', [Validators.required]],
          RememberMe:    [false, [Validators.required]]
        });

      this.RegisterForm = formBuilder.group({
          UsernameRegister: ['', [Validators.required, Validators.email]],
          PasswordRegister: ['', [Validators.required,
                  Validators.minLength(8),
                  Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,15}$/)]],
          ConfirmPassword:  ['', [Validators.required]]
      });

      this.RegisterForm.addValidators(PasswordValidator);
      }

  ngOnInit(): void {
  }

  getAttrLogin(attr:string){
    return this.LoginForm.get(attr);
  }

  getAttrRegister(attr:string){
    return this.RegisterForm.get(attr);
  }

  checkValidatorsLogin(){
    var _userNameControl = this.getAttrLogin('UsernameLogin');
    var _passwordControl = this.getAttrLogin('PasswordLogin');

    if(_userNameControl?.invalid)
        this.toastr.warning('Email is required');

    if(_passwordControl?.invalid && _passwordControl?.touched)
        this.toastr.warning('Password is required');
  }

  checkValidatorsRegister(){
    var _userNameControl = this.getAttrRegister('UsernameRegister');
    var _passwordControl = this.getAttrRegister('PasswordRegister');
    var _confirmPasswordControl = this.getAttrRegister('ConfirmPassword');

    if(_userNameControl?.invalid)
        this.toastr.warning('Invalid Email');

    if(_passwordControl?.invalid && _passwordControl.touched)
      this.toastr.warning('Password must have at least 8 character long. Include a number, symbol, upper and lower case letter');

    if(this.RegisterForm.hasError('mismatch') === true && _confirmPasswordControl?.touched)
      this.toastr.warning('Passwords do not match');

  }

  loginUser(){
    const user:LoginViewModel = {
      Username: this.LoginForm.get('UsernameLogin')?.value,
      Password: this.LoginForm.get('PasswordLogin')?.value,
      RememberMe: this.LoginForm.get('RememberMe')?.value
    };

    this.spinner.show();
    this.UserService.loginUser(user).subscribe({
      next: (response: AuthenticatedResponse) => {
        const token = response.token;
        localStorage.setItem("jwt", token);
        this.toastr.info('Welcome to Open Latino Server');

        this.resetLogin();
        this.spinner.hide();
      },
      error: () => {
        this.toastr.warning('User not registered, please create an account');
        this.spinner.hide();
      }
    });
  }

  changePasswordVisibility(input: HTMLInputElement, img: HTMLImageElement){
    var eye = '../../../../assets/img/eye.png';
    var eyeSlash = '../../../../assets/img/eyeSlash.png';
    const _type: string = input.type;

    if(_type === 'password'){
      input.type = 'text';
      img.src = eyeSlash;
    }
    else{
      input.type = 'password';
      img.src = eye;
    }
  }

  registerUser(){
    var _user:RegisterViewModel = {
      Username: this.RegisterForm.get('UsernameRegister')?.value,
      Password: this.RegisterForm.get('PasswordRegister')?.value,
      ConfirmPassword: this.RegisterForm.get('ConfirmPassword')?.value
    };

    this.spinner.show();
    this.UserService.registerUser(_user).subscribe({
      next: () =>{
        this.toastr.info('Please Login with your credentials','User successfully registered');

        this.resetRegister()
        this.spinner.hide();
       },
      error: () => {
        this.toastr.warning('Username already taken');
        this.spinner.hide();
      }
    });
  }

  resetLogin(){
    this.LoginForm.patchValue({
      UsernameLogin: '',
      PasswordLogin: ''
    })
  }

  resetRegister(){
    this.RegisterForm.patchValue({
      UsernameRegister: '',
      PasswordRegister: '',
      ConfirmPassword: ''
    })
  }

}
