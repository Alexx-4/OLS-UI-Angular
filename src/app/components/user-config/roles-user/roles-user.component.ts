import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { UserService } from 'src/app/services/user.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-roles-user',
  templateUrl: './roles-user.component.html',
  styleUrls: ['./roles-user.component.css']
})
export class RolesUserComponent implements OnInit {

  rolesForm: FormGroup;

  roles: any;
  users: any;
  _user: any;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private formBuilder: FormBuilder,
              private userService: UserService,
              private router: Router,
              private _changeDetectorRef: ChangeDetectorRef,
              private toastr: ToastrService) {

      this.rolesForm = formBuilder.group({
        roles: formBuilder.array([])
      });

  }

  ngOnInit(): void {
    this.getRoles();
    this.getUsers();
  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
  }

  get userRoles(){
    return this.rolesForm.get('roles') as FormArray;
  }

  getRoles(){
    this.userService.getRoles().subscribe({
      next: (data)=>{
        this.roles = data;
      },
      error: () => {this.toastr.error('Error from server. Try again');}
    });
  }

  getUsers(){
    this.userService.getUsers().subscribe({
      next: (data)=>{
        this.users = data;
        console.log(data);
        this.setUserRoles();
        this.setPagination(this.users);
      },
      error: () => {this.toastr.error('Error from server. Try again');}

    });
  }

  setUserRoles(){
    for(let _user of this.users){
      var control: FormControl = this.formBuilder.control(_user.roles);
      this.userRoles.push(control);
    }
  }

  updateRoles(user:any){
    let i = this.users.indexOf(user);
    let newRoles = this.userRoles.at(i).value;

    if(!(newRoles.length)){
      this.userRoles.at(i).patchValue(user.roles);
      this.toastr.info('Users must have at least one role');
      return
    }

    this.userService.updateUserRoles(user, newRoles).subscribe({
      next: ()=>{
        this.getUsers();
      },
      error: () => {this.toastr.error('Error from server. Try again');}
    })
  }

  deleteUser(user: any){
    this.userService.deleteUser(user).subscribe({
      next:()=>{
        this.getUsers();
        this.toastr.info('User successfully deleted');
      },error: () => {this.toastr.error('Error from server. Try again');}}
    )
  }

  getName(w:any){
    return w.name;
  }

}
