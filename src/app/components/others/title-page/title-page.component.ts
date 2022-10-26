import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import global from '../../../../../global.json'

@Component({
  selector: 'app-title-page',
  templateUrl: './title-page.component.html',
  styleUrls: ['./title-page.component.css']
})
export class TitlePageComponent implements OnInit {

  constructor(private router: Router) {
  }

  ngOnInit(): void {
  }

  goLogin(){
    /* if alreadyLogged
          if admin:
              go viewAdmin
          else
            go viewRegularUser*/
    this.router.navigate([global['routeLogin']])
  }

}
