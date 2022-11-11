import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
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
  _layer: LayerModel = new LayerModel();
  _style: any;

  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private layerService:LayerService,
              private router: Router,
              private toastr:ToastrService,
              private styleService:StyleService,
              private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.layerService.updateLayerModel({} as LayerModel);
    this.styleService.getStyles().subscribe(
      data=>{
        this.styles = data;
        this.getLayers();
      }
    );

  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
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
        this.setPagination(this.layers);
      },
      error: (err) => console.log(err)
    });
  }

  deleteLayer(event: MouseEvent, layerId: number | undefined) {
    this.layerService.deleteLayer(layerId as number).subscribe({
      next:()=>{
        this.getLayers();
        this.toastr.info('Layer deleted');
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
    if(this.styles){
      var style = this.styles.find((s: { id: any; })=> s.id === styleId);
      if(style)
        return this.styleService.getImgUrl(style.imageContent);
    }
    return
  }
}
