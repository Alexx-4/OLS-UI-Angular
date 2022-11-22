import { getLocaleDayPeriods } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AlphaInfoModel } from 'src/app/models/AlphaInfoModel';
import { LayerModel } from 'src/app/models/LayerModel';
import { AlphaInfoService } from 'src/app/services/alpha-info.service';
import { LayerService } from 'src/app/services/layer.service';

import global from '../../../../global.json';

@Component({
  selector: 'app-alpha-info',
  templateUrl: './alpha-info.component.html',
  styleUrls: ['./alpha-info.component.css']
})
export class AlphaInfoComponent implements OnInit {
  alphaInfos: AlphaInfoModel[] = []
  _alphaInfo: AlphaInfoModel = new AlphaInfoModel();

  layers: any[] = [];

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private alphaInfoService:AlphaInfoService,
              private router: Router,
              private toastr:ToastrService,
              private layerService: LayerService,
              private _changeDetectorRef: ChangeDetectorRef,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.spinner.show();
    this.layerService.getLayers().subscribe({
      next:(data)=>{
        this.layers = [];
        for(let item of data as Array<any>){
          var layer = {
            id: item.id,
            name: item.layerTranslations[0].name
          };
          this.layers.push(layer);
        }
        this.getAlphaInfos();
      },
      error: () => {this.toastr.error('Error from server. Try again');
                    this.spinner.hide();}}
    )
    this.alphaInfoService.updateAlphaInfoModel({} as AlphaInfoModel);
  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
  }

  getAlphaInfos(){
    this.spinner.show();

    this.alphaInfoService.getAlphaInfos().subscribe({
      next: (data) => {
        this.alphaInfos = [];
        for(let item of data as Array<any>){
          var alphaInfo:AlphaInfoModel = {

            id: item.alfaInfo.id,
            name: item.translations[0].name,
            description: item.translations[0].description,

            connectionString: item.alfaInfo.connectionString,
            table: item.alfaInfo.table,
            pkField: item.alfaInfo.pkField,
            columns: item.alfaInfo.columns,

            layerId: item.alfaInfo.layerId,
            layerName: this.layers.find(l=>l.id === item.alfaInfo.layerId)?.name as string

          };

          this.alphaInfos.push(alphaInfo);
        }
        this.setPagination(this.alphaInfos);
        this.spinner.hide();
      },
      error: () => {
        this.toastr.error('Error from server. Try again');
        this.spinner.hide();}
    });
  }

  deleteAlphaInfo(event: MouseEvent, alphaInfoId: number | undefined) {
    this.spinner.show();
    this.alphaInfoService.deleteAlphaInfo(alphaInfoId as number).subscribe({
      next:()=>{
        this.getAlphaInfos();
        this.toastr.info('AlphaInfo deleted');
        this.spinner.hide();
      },
      error: () => {this.toastr.error('Error from server. Try again');
                    this.spinner.hide();}
    })
  }

  editAlphaInfo(event: MouseEvent, alphaInfo: AlphaInfoModel) {
    event.stopPropagation();
    this.alphaInfoService.updateAlphaInfoModel(alphaInfo);
    this.router.navigate([global['routeCreateAlphaInfo']]);
  }

  infoAlphaInfo(i:number) {
    console.log('Info AlphaInfo');
    console.log(this.alphaInfos[i])
  }

  goCreateAlphaInfo() {
    this.router.navigate([global['routeCreateAlphaInfo']]);
  }


}
