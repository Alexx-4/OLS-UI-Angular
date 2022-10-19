import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { TematicService } from 'src/app/services/tematic.service';

@Component({
  selector: 'app-category-tematic',
  templateUrl: './category-tematic.component.html',
  styleUrls: ['./category-tematic.component.css']
})
export class CategoryTematicComponent implements OnInit {
  tematics:any;

  constructor(private tematicService:TematicService) { }

  ngOnInit(): void {
    this.getCategoryTematics();
  }

  hover(){
    console.log('Click on hover');
  }

  label(event:Event){
    event.stopPropagation();
    console.log('Click on label');
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

}
