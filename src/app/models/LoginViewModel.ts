export class LoginViewModel{
  id?:number;
  Username:string;
  Password: string;
  RememberMe:boolean;

  constructor(){
    this.Username = '';
    this.Password = '';
    this.RememberMe = false;
  }

}
