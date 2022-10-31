import { getLocaleDayPeriods } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  layers: any[] = [];

  constructor(private alphaInfoService:AlphaInfoService,
              private router: Router,
              private toastr:ToastrService,
              private layerService: LayerService) { }

  ngOnInit(): void {
    this.layerService.getLayers().subscribe(
      (data)=>{
        this.layers = [];
        for(let item of data as Array<any>){
          var layer = {
            id: item.id,
            name: item.layerTranslations[0].name
          };
          this.layers.push(layer);
        }
        this.getAlphaInfos();
      }
    )
    this.alphaInfoService.updateAlphaInfoModel({} as AlphaInfoModel);
  }

  getAlphaInfos(){
    this.alphaInfoService.getAlphaInfos().subscribe({
      next: (data) => {
        console.log(data);
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

      },
      error: (err) => console.log(err)
    });
  }

  deleteAlphaInfo(event: MouseEvent, alphaInfoId: number | undefined) {
    event.stopPropagation();
    this.alphaInfoService.deleteAlphaInfo(alphaInfoId as number).subscribe({
      next:()=>{
        this.getAlphaInfos();
        this.toastr.error('AlphaInfo deleted');
      }
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