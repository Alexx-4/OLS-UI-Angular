import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import global from '../../global.json'

import { LoginUserComponent } from './components/authentication/login-user/login-user.component';
import { PageNotFoundComponent } from './components/others/page-not-found/page-not-found.component';
import { CreateProviderComponent } from './components/provider/create-provider/create-provider.component';
import { ProviderComponent } from './components/provider/provider.component';
import { RegisterUserComponent } from './components/authentication/register-user/register-user.component';
import { TitlePageComponent } from './components/others/title-page/title-page.component';
import { LayerComponent } from './components/layer/layer.component';
import { CreateLayerComponent } from './components/layer/create-layer/create-layer.component';
import { AlphaInfoComponent } from './components/alpha-info/alpha-info.component';
import { CreateAlphaInfoComponent } from './components/alpha-info/create-alpha-info/create-alpha-info.component';
import { QueryTematicComponent } from './components/tematics/query-tematic/query-tematic.component';
import { CreateQueryTematicComponent } from './components/tematics/query-tematic/create-query-tematic/create-query-tematic.component';
import { CategoryTematicComponent } from './components/tematics/category-tematic/category-tematic.component';
import { CreateCategoryTematicComponent } from './components/tematics/category-tematic/create-category-tematic/create-category-tematic.component';

const routes: Routes = [
  {path:'', redirectTo:global['routeTitlePage'], pathMatch: 'full'},
  {path: global['routeTitlePage'], component: TitlePageComponent},
  {path: global['routeLogin'], component: LoginUserComponent},
  {path: global['routeRegister'], component: RegisterUserComponent},
  {path: global['routeProvider'], component: ProviderComponent},
  {path: global['routeCreateProvider'], component: CreateProviderComponent},
  {path: global['routeLayer'], component: LayerComponent},
  {path: global['routeCreateLayer'], component: CreateLayerComponent},
  {path: global['routeAlphaInfo'], component: AlphaInfoComponent},
  {path: global['routeCreateAlphaInfo'], component: CreateAlphaInfoComponent},
  {path: global['routeQueryTematic'], component: QueryTematicComponent},
  {path: global['routeCreateQueryTematic'], component: CreateQueryTematicComponent},
  {path: global['routeCategoryTematic'], component: CategoryTematicComponent},
  {path: global['routeCreateCategoryTematic'], component: CreateCategoryTematicComponent},
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
