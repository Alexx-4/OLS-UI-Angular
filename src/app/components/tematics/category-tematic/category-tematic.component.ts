import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { query, TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-category-tematic',
  templateUrl: './category-tematic.component.html',
  styleUrls: ['./category-tematic.component.css']
})
export class CategoryTematicComponent implements OnInit {

  tematics: any;

  constructor(private tematicService:TematicService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getCategoryTematics();
  }

  infoTematic(i:number) {
      if(this.tematics)
    console.log(this.tematics[i]);
    }

  getCategoryTematics(){
    this.tematicService.getCategoryTematics().subscribe({
      next:(data)=>{
        this.tematics = data;
      }
    })
  }

  deleteCategoryTematic(event:Event, id:number) {
    event.stopPropagation();
    this.tematicService.deleteTematic(id).subscribe({
      next: ()=> {
        this.getCategoryTematics();
        this.toastr.info('Tematic successfully deleted');
      }
    });
    }

  goCreateCategory() {
    this.tematicService.updateTematicModel({} as TematicModel);
    this.router.navigate([global['routeCreateCategoryTematic']]);
  }

  editCategoryTematic(event: Event, id:number){
    event.stopPropagation();

    var tematicList = this.tematics.filter((t:any)=>t.tematicId === id);
    var tematic:TematicModel={
      tematicId: id,
      tematicName: tematicList[0].tematicName,
      queries: []
    };

    for(let item of tematicList){
      let _query:query = {
        styleName: item.styleName,
        layerName: item.layerName,
        tableName: item.tableName,
        conditions: []
      };

      let conditions = item.tematicTypeName.split(';');
      var currentCond = conditions[1].split(',');

      _query.conditions.push({
        columnName: currentCond[0],
        _operator: currentCond[1],
        value: currentCond[2],
        logicOperator: null
      })

      for(let i = 2; i<conditions.length; i++){
        currentCond = conditions[i].split(',');

        _query.conditions.push({
          logicOperator: currentCond[0],
          columnName: currentCond[1],
          _operator: currentCond[2],
          value: currentCond[3]
        });
      }

      tematic.queries.push(_query);
    }

    this.tematicService.updateTematicModel(tematic);
    this.router.navigate([global['routeCreateCategoryTematic']]);
  }

}
