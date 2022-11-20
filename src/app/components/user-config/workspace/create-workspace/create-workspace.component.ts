import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { WorkspaceModel } from 'src/app/models/WorkspaceModel';
import { WorkspaceService } from 'src/app/services/workspace.service';

import global from '../../../../../../global.json';
import { LayerService } from 'src/app/services/layer.service';

@Component({
  selector: 'app-create-workspace',
  templateUrl: './create-workspace.component.html',
  styleUrls: ['./create-workspace.component.css']
})
export class CreateWorkspaceComponent implements OnInit {
  WorkspaceForm: FormGroup;

  suscription: Subscription = new Subscription();

  workspace: WorkspaceModel = new WorkspaceModel();

  workspaceId: number | undefined = 0;

  layers: any;
  functions: any;

  constructor(formBuilder: FormBuilder,
              private workspaceService: WorkspaceService,
              private router: Router,
              private toastr:ToastrService,
              private layerService: LayerService) {

    this.WorkspaceForm = formBuilder.group({
        name: ['', Validators.required],
        layers: ['', Validators.required],

        functions: ['', Validators.required]
    })
    }

  ngOnInit(): void {
    this.getLayers();
    this.getFunctions();

    this.workspaceService.getWorkspaceModel().subscribe(
      data=>{
        if(data.id){
          this.WorkspaceForm.patchValue({
            name : data.name,
            layers: data.layers.map(l=>l.name),
            functions: data.funcs.map(f=>f.name)
          });

          this.workspaceId = data.id;
        }
        console.log(data);
      }
    );
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  goWorkspacesList(){
    this.router.navigate([global['routeWorkspace']]);
  }

  getLayers(){
    this.layerService.getLayers().subscribe({
      next: data=>{
        this.layers = [];
        for(let item of data as Array<any>){
          var layer = {
            id: item.id,
            name: item.layerTranslations[0].name
          };

          this.layers.push(layer);
        }
      },
      error: (err) => console.log(err)
    });
  }

  getFunctions(){
    this.workspaceService.getFunctions().subscribe({
      next: data=>{
        this.functions = data;
      }
    })
  }

  getAtrr(atrr:string){
    return this.WorkspaceForm.get(atrr);
  }

  saveWorkspace(){
    var create:boolean = this.workspaceId === 0;

    var layerNames = this.getAtrr('layers')?.value;
    var layerIds: number[] = layerNames.map((l:any) =>{
      return this.layers.find((x: { name: any; })=>x.name === l).id });

    var functionNames = this.getAtrr('functions')?.value;
    var functionIds: number[] = functionNames.map((f:any) =>{
      return this.functions.find((x: { name: any; })=>x.name === f).id });

    var _workspace = {
      id: create ? undefined : this.workspaceId,
      name: this.getAtrr('name')?.value,

      layerIds: layerIds,
      functionIds: functionIds
    }
    console.log(_workspace);

    if(create){
      this.workspaceService.createWorkspace(_workspace).subscribe({
        next:()=>{
          this.goWorkspacesList();
          this.toastr.info('Workspace created successfully');
        },
        error:(err) => console.log(err)
      });
    }

    else{
      this.workspaceService.editWorkspace(_workspace).subscribe({
        next: ()=>{
          this.workspaceId = 0;
          this.goWorkspacesList();
          this.toastr.info('Workspace edited successfully');
        }
      })
    }
  }
}
