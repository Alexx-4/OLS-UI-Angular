import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ClientAppModel } from 'src/app/models/ClientAppModel';
import { ClientAppService } from 'src/app/services/client-app.service';
import { UserService } from 'src/app/services/user.service';


import global from '../../../../../global.json';

@Component({
  selector: 'app-client-app',
  templateUrl: './client-app.component.html',
  styleUrls: ['./client-app.component.css']
})
export class ClientAppComponent implements OnInit {

  clientApps: ClientAppModel[] = [];
  _clientApp: ClientAppModel = new ClientAppModel();


  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private clientAppService: ClientAppService,
              private _changeDetectorRef: ChangeDetectorRef,
              private toastr: ToastrService,
              private router:Router,
              private userService: UserService) { }

  ngOnInit(): void {
    this.clientAppService.updateClientAppModel({} as ClientAppModel);
    this.getClientApps(this.user);
  }

  get user(){
    var _user = this.userService.user;
    if (_user?.userRole === 'Admin')
        return undefined;
    return _user?.userId;
  }

  getClientApps(userId: string | undefined){
    this.clientAppService.getClientApps(userId).subscribe({
      next: (data)=>{
        this.clientApps = data as Array<ClientAppModel>;

        this.setPagination(this.clientApps);
      },
      error: () => {this.toastr.error('Error from server. Try again');}
    });
  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
  }

  deleteClientApp(id:string | undefined){
    this.clientAppService.deleteClientApp(id as string).subscribe({
      next: (data)=>{
        this.toastr.info('ClientApp successfully deleted');
        this.getClientApps(this.user);
      },
      error: () => {this.toastr.error('Error from server. Try again');}
    });
  }

  goCreateClientApp(){
    this.router.navigate([global['routeCreateClientApp']]);
  }

  editClientApp(clientApp: ClientAppModel){
    this.clientAppService.updateClientAppModel(clientApp);
    this.router.navigate([global['routeCreateClientApp']]);
  }

  getName(c:any){
    return c.name;
  }


}
