import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayerModel } from 'src/app/models/LayerModel';
import { ProviderModel } from 'src/app/models/ProviderModel';
import { LayerService } from 'src/app/services/layer.service';
import { ProviderService } from 'src/app/services/provider.service';
import global from '../../../../global.json';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {

  layers: LayerModel[] = [];

  constructor(private layerService:LayerService,
              private router: Router,
              private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getLayers();
  }



  getLayers(){
    this.layerService.getLayers().subscribe({
      next: (data) => {
        this.layers = [];
        for(let item of data as Array<any>){
          var layer:LayerModel = {
            id: item.id,
            name: item.layerTranslations[0].name,
            description: item.layerTranslations[0].description,

            providerInfoId: item.providerInfoId,
            order: item.order,

            providerName: item.providerTranslations[0],

            styles: item.styles

          };

          this.layers.push(layer);
        }
      },
      error: (err) => console.log(err)
    });
  }

  deleteLayer(event: MouseEvent, layerId: number | undefined) {
    event.stopPropagation();
    this.layerService.deleteLayer(layerId as number).subscribe({
      next:()=>{
        this.getLayers();
        this.toastr.error('Layer deleted');
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  editLayer(event: MouseEvent, layer: LayerModel) {
    event.stopPropagation();
    this.layerService.updateLayerModel(layer);
    this.router.navigate([global['routeCreateLayer']]);
  }

  infoLayer(i:number) {
    console.log('Info Layer');
    console.log(this.layers[i])
  }

  goCreateLayer() {
    this.router.navigate([global['routeCreateLayer']]);
  }

}
