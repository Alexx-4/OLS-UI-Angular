import { getLocaleDayPeriods } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { timeStamp } from 'console';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AlphaInfoModel } from 'src/app/models/AlphaInfoModel';
import { AlphaInfoService } from 'src/app/services/alpha-info.service';
import { LayerService } from 'src/app/services/layer.service';
import { ProviderService } from 'src/app/services/provider.service';
import { DuplicateNameValidator } from 'src/app/validators/duplicateName.validator';


import global from '../../../../../global.json'

@Component({
  selector: 'app-create-alpha-info',
  templateUrl: './create-alpha-info.component.html',
  styleUrls: ['./create-alpha-info.component.css']
})
export class CreateAlphaInfoComponent implements OnInit, OnDestroy {

  AlphaInfoForm: FormGroup;

  suscription: Subscription = new Subscription();

  alphaInfoId: number | undefined = 0;

  layers:any[] = [];
  tables:any[] = [];
  columns:any[] = [];
  providers:any[] = [];

  init : boolean = true;

  constructor(formBuilder: FormBuilder,
              private alphaInfoService: AlphaInfoService,
              private router: Router,
              private toastr:ToastrService,
              private layerService: LayerService,
              private providerService: ProviderService) {

    this.AlphaInfoForm = formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],

        connString: ['', Validators.required],
        table: ['', Validators.required],
        pkField: ['', Validators.required],
        layerName:['', Validators.required],
        columns:['', Validators.required],
        providerInfo: true

    })
    }

  ngOnInit(): void {
    this.getProviders();
    this.getAlphaInfos();

    this.suscription = this.alphaInfoService.getAlphaInfoModel().subscribe({
      next:(data)=>{
        if(data.name){
          this.AlphaInfoForm.patchValue({
            name: data.name,
            description: data.description,
            connString: data.connectionString,
            pkField: data.pkField,

            layerName: data.layerName,
            table: data.table,
            columns: data.columns.split(',')
          });
          this.alphaInfoId = data.id;
        }
        this.getLayers();
      }
    });
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  getProviders(){
    this.providerService.getProviders().subscribe({
      next:(data)=>{
        for(let item of data as Array<{provider:any}>){
          this.providers.push(item.provider);
        }
      },
      error: () => {this.toastr.error('Error from server. Try again');}}
    );
  }

  getAlphaInfos(){
    this.alphaInfoService.getAlphaInfos().subscribe({
      next: data=>{
        var alphaInfos: {name:string}[] = [];
        for(let item of data as Array<any>){
            alphaInfos.push({name: item.translations[0].name});
        }
        const name = this.getAtrr('name');
        name?.addValidators(DuplicateNameValidator(alphaInfos, 'name'));
      },
      error: () => {this.toastr.error('Error from server. Try again');}
    })
  }

  getLayers(){
    this.layerService.getLayers().subscribe({
      next: (data)=>{
        this.layers = [];
        for(let item of data as Array<any>){
          var layer = {
            id: item.id,
            name: item.layerTranslations[0].name,
            providerInfoId: item.providerInfoId
          };
          this.layers.push(layer);
        }

        if(this.alphaInfoId as number > 0){
          var _layerName = this.getAtrr('layerName')?.value;
          var _layer = this.layers.find(l=>l.name === _layerName);
          var _provider = this.providers.find(p=>p.id === _layer.providerInfoId);

          var connString = this.getAtrr('connString')?.value;
          var _tableName = this.getAtrr('table')?.value;

          var _providerInfo = _provider.connectionString === connString &&
                              _provider.table === _tableName;

          this.AlphaInfoForm.patchValue({ providerInfo: _providerInfo });


          this.getTables();
          this.getColumns();
          this.init = false;
      }
      },error: () => {this.toastr.error('Error from server. Try again');}}
    )
  }

  getTables(){
    if(!this.init){
      this.AlphaInfoForm.patchValue({table:'', columns:''});
    }

    var providerInfo = this.getAtrr('providerInfo')?.value;

    if(providerInfo){
      var _layerName:string = this.getAtrr('layerName')?.value;

      if(_layerName){
        var _layer = this.layers.find(l=>l.name === _layerName);
        var _provider = this.providers.find(p=>p.id === _layer.providerInfoId);

        this.tables = [_provider.table];
        this.AlphaInfoForm.patchValue({table: _provider.table,
                                       connString: _provider.connectionString,
                                       pkField: _provider.pkField});
        this.getColumns();
      }
      else {this.tables = [];}
    }

    else{
      var connString = this.getAtrr('connString')?.value;

      this.providerService.getProviderInfo(connString).subscribe({
        next: (data)=>{
          this.tables = data as Array<string>;
        },
        error: ()=>{
          this.tables = [];
          this.toastr.info('Cannot connect with external database');
        }
      });
    }
  }

  getColumns(){
    if(!this.init){
      this.AlphaInfoForm.patchValue({columns:''});
    }

    var providerInfo = this.getAtrr('providerInfo')?.value;
    var _tableName = this.getAtrr('table')?.value;

    if(providerInfo){
        var _layerName = this.getAtrr('layerName')?.value;

        if(_layerName && _tableName){
          var _layer = this.layers.find(l=>l.name === _layerName);
          this.providerService.getProviderInfo(null,_layer.id,_tableName).subscribe({
            next:(data)=>{
              this.columns = data as Array<string>;},

              error: () => {this.toastr.error('Error from server. Try again');}}
          );
        }
        else{this.columns = [];}
      }

      else{
        var connString = this.getAtrr('connString')?.value;

        this.providerService.getProviderInfo(connString, undefined, _tableName).subscribe({
          next: (data)=>{
            this.columns = data as Array<string>;
          },
          error: ()=>{
            this.columns = [];
            this.toastr.info('There is no columns to database information provided');
          }
        })
      }
  }

  goAlphaInfosList(){
    this.router.navigate([global['routeAlphaInfo']]);
  }

  getAtrr(atrr:string){
    return this.AlphaInfoForm.get(atrr);
  }

  saveAlphaInfo(){
    var create:boolean = this.alphaInfoId === 0;

    var _layerName:string = this.getAtrr('layerName')?.value;

    var _alphaInfo:AlphaInfoModel = {
      id: (create) ? undefined : this.alphaInfoId,
      name: this.getAtrr('name')?.value,
      description: this.getAtrr('description')?.value,

      connectionString: this.getAtrr('connString')?.value,
      pkField: this.getAtrr('pkField')?.value,
      table: this.getAtrr('table')?.value,

      layerId: this.layers.find(l=>l.name === _layerName).id,
      layerName: _layerName,
      columns: (this.getAtrr('columns')?.value as Array<string>).toString()
    }

    if(create){
      this.alphaInfoService.createAlphaInfo(_alphaInfo).subscribe({
        next:()=>{
          this.goAlphaInfosList();
          this.toastr.info('AlphaInfo created successfully');
        },
        error: () => {this.toastr.error('Error from server. Try again');}
      });
    }
    else{
      this.alphaInfoService.editAlphaInfo(_alphaInfo).subscribe({
        next: ()=>{
          this.alphaInfoId = 0;
          this.goAlphaInfosList();
          this.toastr.info('AlphaInfo edited successfully');
        },
        error: () => {this.toastr.error('Error from server. Try again');}
      });
    }
  }
}

