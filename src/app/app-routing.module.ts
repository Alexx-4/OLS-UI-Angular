import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import global from '../../global.json'
import { LoginUserComponent } from './components/login-user/login-user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CreateComponent } from './components/query-tematic/create/create.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { TitlePageComponent } from './components/title-page/title-page.component';

const routes: Routes = [
  {path:'', redirectTo:global['routeTitlePage'], pathMatch: 'full'},
  {path: global['routeTitlePage'], component: TitlePageComponent},
  {path: global['routeLogin'], component: LoginUserComponent},
  {path: global['routeRegister'], component: RegisterUserComponent},
  {path: global['routeQueryTematic'], component: CreateComponent},
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
