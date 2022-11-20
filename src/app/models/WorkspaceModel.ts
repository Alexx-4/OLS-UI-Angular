export class WorkspaceModel{
  id?:number;
  name: string;
  userId: string;
  userName: string;
  clientApps: {id:number, name:string}[];
  funcs: {id:number, name:string}[];
  layers: {id:number, name:string}[]

  constructor() {
    this.name = '';
    this.userId = '';
    this.userName = '';
    this.clientApps = [];
    this.funcs = [];
    this.layers = [];
  }
}
