import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProviderModel } from 'src/app/models/ProviderModel';
import { ProviderService } from 'src/app/services/provider.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.css']
})
export class CreateProviderComponent implements OnInit, OnDestroy {

  ProviderForm: FormGroup;

  suscription: Subscription = new Subscription();

  providerId: number | undefined = 0;

  constructor(formBuilder: FormBuilder,
              private providerService: ProviderService,
              private router: Router,
              private toastr:ToastrService) {

    this.ProviderForm = formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],

        connString: ['', Validators.required],
        table: ['', Validators.required],
        geoField: ['', Validators.required],
        pkField: ['', Validators.required],
        boundingBoxField: ['', Validators.required],
    })
    }

  ngOnInit(): void {
    this.suscription = this.providerService.getProviderModel().subscribe({
      next:(data)=>{
        if(data.name){
          this.ProviderForm.patchValue({
            name: data.name,
            description: data.description,
            connString: data.connectionString,
            table: data.table,
            geoField: data.geoField,
            pkField: data.geoField,
            boundingBoxField: data.boundingBoxField
          });
          this.providerId = data.id;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  goProvidersList(){
    this.router.navigate([global['routeProvider']]);
  }

  getAtrr(atrr:string){
    return this.ProviderForm.get(atrr);
  }

  saveProvider(){
    var create:boolean = this.providerId === 0;

    var _provider:ProviderModel = {
      id: (create) ? undefined : this.providerId,
      name: this.getAtrr('name')?.value,
      description: this.getAtrr('description')?.value,

      connectionString: this.getAtrr('connString')?.value,
      geoField: this.getAtrr('geoField')?.value,
      pkField: this.getAtrr('pkField')?.value,
      boundingBoxField: this.getAtrr('boundingBoxField')?.value,
      table: this.getAtrr('table')?.value
    }
    if(create){
      this.providerService.createProvider(_provider).subscribe({
        next:()=>{
          this.goProvidersList();
          this.toastr.info('Provider created successfully');
        },
        error:(err) => console.log(err)
      });
    }
    else{
      this.providerService.editProvider(_provider).subscribe({
        next: ()=>{
          this.providerId = 0;
          this.goProvidersList();
          this.toastr.info('Provider edited successfully');
        }
      })
    }
  }
}
