import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { ProviderModel } from 'src/app/models/ProviderModel';
import { ProviderService } from 'src/app/services/provider.service';

import global from '../../../../global.json';

@Component({
  selector: 'app-provider',
  templateUrl: './provider.component.html',
  styleUrls: ['./provider.component.css']
})
export class ProviderComponent implements OnInit {
  providers: any[] = []

  constructor(private providerService:ProviderService,
              private router: Router,
              private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getProviders();
  }

  getProviders(){
    this.providerService.getProviders().subscribe({
      next: (data) => {
        this.providers = [];
        for(let item of data as Array<any>){
          var provider:ProviderModel = {
            id: item.provider.id,
            name: item.providerTranslation[0].name,
            description: item.providerTranslation[0].description,

            connectionString: item.provider.connectionString,
            table: item.provider.table,

            geoField: item.provider.geoField,
            pkField: item.provider.pkField,

            boundingBoxField: item.provider.boundingBoxField

          };

          this.providers.push(provider);
        }
      },
      error: (err) => console.log(err)
    });
  }

  deleteProvider(event: MouseEvent, providerId: number) {
    event.stopPropagation();
    this.providerService.deleteProvider(providerId).subscribe({
      next:()=>{
        this.getProviders();
        this.toastr.error('Provider deleted');
      }
    })
  }

  editProvider(event: MouseEvent, provider: ProviderModel) {
    event.stopPropagation();
    this.providerService.updateProviderModel(provider);
    this.router.navigate([global['routeCreateProvider']]);
  }

  infoProvider(i:number) {
    console.log('Info Provider');
    console.log(this.providers[i])
  }

  goCreateProvider() {
    this.router.navigate([global['routeCreateProvider']]);
  }



}
