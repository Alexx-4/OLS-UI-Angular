import { getLocaleDayPeriods } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { AlphaInfoModel } from 'src/app/models/AlphaInfoModel';
import { AlphaInfoService } from 'src/app/services/alpha-info.service';
import { LayerService } from 'src/app/services/layer.service';


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

  constructor(formBuilder: FormBuilder,
              private alphaInfoService: AlphaInfoService,
              private router: Router,
              private toastr:ToastrService,
              private layerService: LayerService) {

    this.AlphaInfoForm = formBuilder.group({
        name: ['', Validators.required],
        description: ['', Validators.required],

        connString: ['', Validators.required],
        table: ['', Validators.required],
        pkField: ['', Validators.required],
        layerName:['', Validators.required],
        columns:['', Validators.required]

    })
    }

  ngOnInit(): void {

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

  getLayers(){
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

        if(this.alphaInfoId as number > 0){
            this.getTables();
            this.getColumns();
      }
      }
    )
  }

  getTables(){
    var _layerName:string = this.getAtrr('layerName')?.value;

    if(_layerName){
      var _layer = this.layers.find(l=>l.name === _layerName);
      this.alphaInfoService.getTablesColumns(_layer.id).subscribe(
        (data)=>{
          this.tables = data as Array<string>;
        }
      );
    }
    else {this.tables = [];}
  }

  getColumns(){
    var _layerName = this.getAtrr('layerName')?.value;
    var _tableName = this.getAtrr('table')?.value;

    if(_layerName && _tableName){
      var _layer = this.layers.find(l=>l.name === _layerName);
      this.alphaInfoService.getTablesColumns(_layer.id, _tableName).subscribe(
        (data)=>{
          this.columns = data as Array<string>;}
      );
    }
    else{this.columns = [];}
  }

  goAlphaInfosList(){
    this.router.navigate([global['routeAlphaInfo']]);
  }

  getAtrr(atrr:string){
    return this.AlphaInfoForm.get(atrr);
  }

  saveAlphaInfo(){
    var create:boolean = this.alphaInfoId === 0;

    var _alphaInfo:AlphaInfoModel = {
      id: (create) ? undefined : this.alphaInfoId,
      name: this.getAtrr('name')?.value,
      description: this.getAtrr('description')?.value,

      connectionString: this.getAtrr('connString')?.value,
      pkField: this.getAtrr('pkField')?.value,
      table: this.getAtrr('table')?.value,

      layerId: this.layers.find(l=>l.name === this.getAtrr('layerName')?.value).id,
      layerName: this.getAtrr('layerName')?.value,
      columns: (this.getAtrr('columns')?.value as Array<string>).toString()
    }

    if(create){
      this.alphaInfoService.createAlphaInfo(_alphaInfo).subscribe({
        next:()=>{
          this.goAlphaInfosList();
          this.toastr.success('AlphaInfo created successfully');
        },
        error:(err) => console.log(err)
      });
    }
    else{
      this.alphaInfoService.editAlphaInfo(_alphaInfo).subscribe({
        next: ()=>{
          this.alphaInfoId = 0;
          this.goAlphaInfosList();
          this.toastr.info('AlphaInfo edited successfully');
        }
      });
    }
  }
}

