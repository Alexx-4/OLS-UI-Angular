import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TematicModel } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

import global from '../../../../../global.json'

@Component({
  selector: 'app-query-tematic',
  templateUrl: './query-tematic.component.html',
  styleUrls: ['./query-tematic.component.css']
})
export class QueryTematicComponent implements OnInit {

  tematics: any;

  constructor(private tematicService:TematicService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getQueryTematics();
  }

  infoTematic(i:number) {
      if(this.tematics)
    console.log(this.tematics[i]);
    }

  getQueryTematics(){
    this.tematicService.getQueryTematics().subscribe({
      next:(data)=>{
        this.tematics = data;
      }
    })
  }

  deleteQueryTematic(event:Event, id:number) {
    event.stopPropagation();
    this.tematicService.deleteTematic(id).subscribe({
      next: ()=> {
        this.getQueryTematics();
        this.toastr.info('Tematic successfully deleted');
      }
    });
    }

  goCreateQuery() {
    this.tematicService.updateTematicModel({} as TematicModel);
    this.router.navigate([global['routeCreateQueryTematic']]);
  }

  editQueryTematic(event: Event, tematic:any){
    event.stopPropagation();
  }

}
