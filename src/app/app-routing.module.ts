import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import global from '../../global.json'

import { CategoryTematicComponent } from './components/category-tematic/category-tematic.component';
import { CreateCategoryTematicComponent } from './components/category-tematic/create-category-tematic/create-category-tematic.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ProviderComponent } from './components/provider/provider.component';
import { CreateQueryTematicComponent } from './components/query-tematic/create-query-tematic/create-query-tematic/create-query-tematic.component';
import { QueryTematicComponent } from './components/query-tematic/query-tematic.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { TitlePageComponent } from './components/title-page/title-page.component';

const routes: Routes = [
  {path:'', redirectTo:global['routeTitlePage'], pathMatch: 'full'},
  {path: global['routeTitlePage'], component: TitlePageComponent},
  {path: global['routeLogin'], component: LoginUserComponent},
  {path: global['routeRegister'], component: RegisterUserComponent},
  {path: global['routeCreateQueryTematic'], component: CreateQueryTematicComponent},
  {path: global['routeCreateCategoryTematic'], component: CreateCategoryTematicComponent},
  {path: global['routeCategoryTematic'], component: CategoryTematicComponent},
  {path: global['routeQueryTematic'], component: QueryTematicComponent},
  {path: global['routeProvider'], component: ProviderComponent},
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
