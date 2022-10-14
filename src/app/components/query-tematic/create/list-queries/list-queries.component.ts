import { Component, OnInit } from '@angular/core';
import { query } from 'src/app/models/tematicModel';
import { TematicService } from 'src/app/services/tematic.service';

@Component({
  selector: 'app-list-queries',
  templateUrl: './list-queries.component.html',
  styleUrls: ['./list-queries.component.css']
})
export class ListQueriesComponent implements OnInit {

  constructor(public tematicService: TematicService) { }

  ngOnInit(): void {
  }

  deleteQuery(i:number){
    this.tematicService.removeQuery(i);
  }

  editQuery(i:number){
    this.tematicService.updateQuery(i);
  }

}
