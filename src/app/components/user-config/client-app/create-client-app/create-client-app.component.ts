import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ClientAppModel } from 'src/app/models/ClientAppModel';
import { ClientAppService } from 'src/app/services/client-app.service';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';

import global from '../../../../../../global.json';

@Component({
  selector: 'app-create-client-app',
  templateUrl: './create-client-app.component.html',
  styleUrls: ['./create-client-app.component.css']
})
export class CreateClientAppComponent implements OnInit {
  ClientAppForm: FormGroup;

  suscription: Subscription = new Subscription();

  clientAppId: string | undefined = '';
  userId : string = '';

  workspaces:any;

  constructor(formBuilder: FormBuilder,
              private clientAppService: ClientAppService,
              private router: Router,
              private toastr:ToastrService,
              private workspaceService: WorkspaceService,
              private userService: UserService) {

    this.ClientAppForm = formBuilder.group({
        name: ['', Validators.required],
        applicationType: ['CommunApp', Validators.required],

        workspaces: ['', Validators.required],
        disable: [false, Validators.required]
    })
    }

  ngOnInit(): void {
        this.clientAppService.getClientAppModel().subscribe(
      data=>{
        if(data.id){
          this.ClientAppForm.patchValue({
            name: data.name,
            applicationType: data.applicationType,
            workspaces: data.workspaces.map(w=>w.name),
            disable: !data.active
          });
          this.clientAppId = data.id;
          this.userId = data.userId;
        }
        this.getWorkspaces();
      }
    );
  }

  get user(){
    if(this.clientAppId === '')
        return this.userService.user?.userId;

    return this.userId;
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  goClientAppsList(){
    this.router.navigate([global['routeClientApp']]);
  }

  getWorkspaces(){
    this.workspaceService.getWorkspaces(this.user).subscribe({
      next: data=>{
        this.workspaces = data;
      },
      error:err=>{
        console.log(err);
        this.router.navigate([global['routeTitlePage']]);
      }
    }
    )
  }

  getAtrr(atrr:string){
    return this.ClientAppForm.get(atrr);
  }

  saveClientApp(){
    var create:boolean = this.clientAppId === '';

    var workspaceNames = this.getAtrr('workspaces')?.value;
    var _workspaceIds: number[] = workspaceNames.map((w:any) =>{
      return this.workspaces.find((x: { name: any; })=>x.name === w).id });

    var _clientApp = {
      clientId: create ? undefined : this.clientAppId,
      workspacesId: _workspaceIds,
      name: this.getAtrr('name')?.value,
      applicationType: this.getAtrr('applicationType')?.value,
      active: !this.getAtrr('disable')?.value
    };

    if(create){
      this.clientAppService.createClientApp(_clientApp).subscribe({
        next:()=>{
          this.goClientAppsList();
          this.toastr.info('ClientApp created successfully');
        },
        error:(err) => console.log(err)
      });
    }

    else{
      this.clientAppService.editClientApp(_clientApp).subscribe({
        next: ()=>{
          this.clientAppId = '';
          this.userId = '';
          this.goClientAppsList();
          this.toastr.info('ClientApp edited successfully');
        }
      })
    }
  }

}
