import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { LayerModel } from 'src/app/models/LayerModel';
import { StyleModel } from 'src/app/models/StyleModel';
import { LayerService } from 'src/app/services/layer.service';
import { ProviderService } from 'src/app/services/provider.service';
import { StyleService } from 'src/app/services/style.service';

import global from '../../../../../global.json';

@Component({
  selector: 'app-create-layer',
  templateUrl: './create-layer.component.html',
  styleUrls: ['./create-layer.component.css']
})
export class CreateLayerComponent implements OnInit {
  LayerForm: FormGroup;

  suscription: Subscription = new Subscription();

  layer: LayerModel = new LayerModel();
  layerId: number | undefined = 0;

  providers: any;
  styles: StyleModel[] = [];

  constructor(formBuilder: FormBuilder,
              private layerService: LayerService,
              private router: Router,
              private toastr:ToastrService,
              public styleService: StyleService,
              private providerService:ProviderService) {

    this.LayerForm = formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],

        provider: ['', Validators.required],
        order: ['', Validators.required],
        styles: ['', Validators.required]
    })
    }

  ngOnInit(): void {
    this.styleService.getStyles().subscribe({
      next:(data)=>{
        this.styles = data as Array<StyleModel>;
      }
    });

    this.providerService.getProviders().subscribe({
      next:(data)=>{
        this.providers = data;
      }
    })


    this.suscription = this.layerService.getLayerModel().subscribe({
      next:(data)=>{
        console.log(data);
        if(data.name){
          this.layer = data;

          this.LayerForm.patchValue({
            name: this.layer.name,
            description: this.layer.description,
            provider: this.layer.providerName,
            order: this.layer.order,
            styles: this.layer.styles
          });
          this.layerId = data.id;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  goLayersList(){
    this.router.navigate([global['routeLayer']]);
  }

  getAtrr(atrr:string){
    return this.LayerForm.get(atrr);
  }

  saveLayer(){
    var create:boolean = this.layerId === 0;
    var _idProvider = this.providers.find((item: { providerTranslation: { name: string; }[]; }) =>
                                          item.providerTranslation[0].name === this.getAtrr('provider')?.value)
                                          .provider.id;

    var _layer:LayerModel = {
      id: (create) ? undefined : this.layerId,
      name: this.getAtrr('name')?.value,
      description: this.getAtrr('description')?.value,

      providerInfoId: _idProvider,
      providerName: this.getAtrr('provider')?.value,
      styles: this.getAtrr('styles')?.value,
      order: this.getAtrr('order')?.value
    }
    console.log(_layer);
    if(create){
      this.layerService.createLayer(_layer).subscribe({
        next:()=>{
          this.goLayersList();
          this.toastr.info('Layer created successfully');
        },
        error:(err) => {
          console.log(err);
          this.toastr.info('Cannot create layer with order and provider selected')
        }

      });
    }
    else{
      this.layerService.editLayer(_layer).subscribe({
        next: ()=>{
          this.layerId = 0;
          this.goLayersList();
          this.toastr.info('Layer edited successfully');
        },
        error: (err) => {
          console.log(err);
          this.toastr.info('Cannot edit layer with order and provider selected')
        }
      })
    }
  }
}
