import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TematicModel, query } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-category-tematic',
  templateUrl: './category-tematic.component.html',
  styleUrls: ['./category-tematic.component.css']
})
export class CategoryTematicComponent implements OnInit {

  tematics:any;

  constructor(private tematicService:TematicService,
              private router:Router) { }

  ngOnInit(): void {
    this.getCategoryTematics();
  }

  hover(){
    console.log('Click on hover');
  }

  getCategoryTematics(){
    this.tematicService.getCategoryTematics().subscribe({
      next:(data)=>{
        this.tematics = data;
      },
      error: (err) =>{
        console.log('Error');
      }
    })
  }

  deleteCategoryTematic(event:Event, id:number){
    event.stopPropagation();
    this.tematicService.deleteTematic(id).subscribe({
      next: ()=> {
        this.getCategoryTematics();
      }
    });
  }

  editCategoryTematic(event:Event, tematicId:number){
    event.stopPropagation();

    var tematicList = this.tematics.filter((t:any)=>t.tematicId === tematicId);
    var tematic:TematicModel={
      tematicId: tematicId,
      tematicName: tematicList[0].tematicName,
      queries: []
    }

    for(let item of tematicList){
      let query:query = {
        styleName: item.styleName,
        layerName: item.layerName,
        conditions: []
      };
      let conditions = item.tematicTypeName.split(';');
      var currentCond = conditions[1].split(',');

      query.conditions.push({
        columnName: currentCond[0],
        _operator: currentCond[1],
        value: currentCond[2],
        logicOperator: null
      })

      for(let i = 2; i<conditions.length; i++){
        currentCond = conditions[i].split(',');
        query.conditions.push({
          logicOperator: currentCond[0],
          columnName: currentCond[1],
        _operator: currentCond[2],
        value: currentCond[3]
        });
      }

      tematic.queries.push(query);
    }

    this.tematicService.updateTematicModel(tematic);
    this.router.navigate([global['routeCreateCategoryTematic']]);

  }

  goCreateCategory(){
    this.tematicService.updateTematicModel({} as TematicModel);
    this.router.navigate([global['routeCreateCategoryTematic']]);
  }

}
