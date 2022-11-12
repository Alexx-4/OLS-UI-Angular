export class WorkspaceModel{
  id?:number;
  name: string;
  userId: string;
  userName: string;
  clientApps: string[];
  funcs: String[];

  constructor() {
    this.name = '';
    this.userId = '';
    this.userName = '';
    this.clientApps = [];
    this.funcs = [];
  }
}
