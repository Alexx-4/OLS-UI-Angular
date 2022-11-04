import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LayerModel } from 'src/app/models/LayerModel';
import { ProviderModel } from 'src/app/models/ProviderModel';
import { StyleModel } from 'src/app/models/StyleModel';
import { LayerService } from 'src/app/services/layer.service';
import { ProviderService } from 'src/app/services/provider.service';
import { StyleService } from 'src/app/services/style.service';
import global from '../../../../global.json';

@Component({
  selector: 'app-layer',
  templateUrl: './layer.component.html',
  styleUrls: ['./layer.component.css']
})
export class LayerComponent implements OnInit {

  layers: LayerModel[] = [];
  styles:any;

  constructor(private layerService:LayerService,
              private router: Router,
              private toastr:ToastrService,
              private styleService:StyleService) { }

  ngOnInit(): void {
    this.layerService.updateLayerModel({} as LayerModel);
    this.styleService.getStyles().subscribe(
      data=>{
        this.styles = data;
        this.getLayers();
      }
    );

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

            styles: (item.styles as Array<StyleModel>).map(({name})=>name),
            stylesId: (item.styles as Array<StyleModel>).map(({id})=>id)
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

  printImage(styleId:number){
    var style = this.styles.find((s: { id: any; })=> s.id === styleId);
    if(style)
      return this.styleService.getImgUrl(style.imageContent);
    return
  }

}
