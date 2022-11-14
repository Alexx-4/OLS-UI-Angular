export class WorkspaceModel{
  id?:number;
  name: string;
  userId: string;
  userName: string;
  clientApps: {Id:number, Name:string}[];
  funcs: {Id:number, Name:string}[];
  layers: {Id:number, Name:string}[]

  constructor() {
    this.name = '';
    this.userId = '';
    this.userName = '';
    this.clientApps = [];
    this.funcs = [];
    this.layers = [];
  }
}
