import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { WorkspaceModel } from 'src/app/models/WorkspaceModel';
import { UserService } from 'src/app/services/user.service';
import { WorkspaceService } from 'src/app/services/workspace.service';


import global from '../../../../../global.json';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnInit {

  workspaces: WorkspaceModel[] = [];
  _workspace: WorkspaceModel = new WorkspaceModel();



  dataSource!: MatTableDataSource<any>;
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  dataObs!: Observable<any>;

  constructor(private workspaceService: WorkspaceService,
              private _changeDetectorRef: ChangeDetectorRef,
              private toastr: ToastrService,
              private router:Router,
              private userService: UserService,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.workspaceService.updateWorkspaceModel({} as WorkspaceModel);
    this.getWorkspaces(this.user);
  }

  get user(){
    var _user = this.userService.user;
    if (_user?.userRole === 'Admin')
        return undefined;
    return _user?.userId;
  }

  getWorkspaces(userId: string | undefined){
    this.spinner.show();
    this.workspaceService.getWorkspaces(userId).subscribe({
      next: (data)=>{
        this.workspaces = data as Array<WorkspaceModel>;
        console.log(this.workspaces);
        this.setPagination(this.workspaces);
        this.spinner.hide();
      },
      error: () => {this.toastr.error('Error from server. Try again');
                    this.spinner.hide();}
    })
  }

  setPagination(tableData:any) {
    this.dataSource = new MatTableDataSource<any>(tableData);
    this._changeDetectorRef.detectChanges();
    this.dataSource.paginator = this.paginator;
    this.dataObs = this.dataSource.connect();
  }

  deleteWorkspace(id:number | undefined){
    this.spinner.show();
    this.workspaceService.deleteWorkspace(id as number).subscribe({
      next: ()=>{
        this.toastr.info('Workspace successfully deleted');
        this.getWorkspaces(this.user);
      },
      error: () => {this.toastr.error('Error from server. Try again');
                    this.spinner.hide();}
    })
  }

  goCreateWorkspace(){
    this.router.navigate([global['routeCreateWorkspace']]);
  }

  editWorkspace(workspace: WorkspaceModel){
    this.workspaceService.updateWorkspaceModel(workspace);
    this.router.navigate([global['routeCreateWorkspace']]);
  }

  getName(c:any){
    return c.name;
  }

}
