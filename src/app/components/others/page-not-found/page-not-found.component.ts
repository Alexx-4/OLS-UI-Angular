import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  a = false;
  constructor() { }

  ngOnInit(): void {
  }
  clickf(){
    var a = document.getElementById("ale");
    a?.toggleAttribute("open")
  }

}
