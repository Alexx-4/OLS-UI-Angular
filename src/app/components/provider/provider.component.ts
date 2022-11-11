import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
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

  _provider: ProviderModel = new ProviderModel();

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private providerService:ProviderService,
              private router: Router,
              private toastr:ToastrService,
              private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.providerService.updateProviderModel({} as ProviderModel);
    this.getProviders();
  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
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
        this.setPagination(this.providers);
      },
      error: (err) => console.log(err)
    });
  }

  deleteProvider(event: MouseEvent, providerId: number | undefined) {
    this.providerService.deleteProvider(providerId as number).subscribe({
      next:()=>{
        this.getProviders();
        this.toastr.info('Provider deleted');
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
