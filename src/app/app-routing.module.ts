import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import global from '../../global.json'

import { CreateProviderComponent } from './components/provider/create-provider/create-provider.component';
import { ProviderComponent } from './components/provider/provider.component';
import { TitlePageComponent } from './components/others/title-page/title-page.component';
import { LayerComponent } from './components/layer/layer.component';
import { CreateLayerComponent } from './components/layer/create-layer/create-layer.component';
import { AlphaInfoComponent } from './components/alpha-info/alpha-info.component';
import { CreateAlphaInfoComponent } from './components/alpha-info/create-alpha-info/create-alpha-info.component';
import { QueryTematicComponent } from './components/tematics/query-tematic/query-tematic.component';
import { CreateQueryTematicComponent } from './components/tematics/query-tematic/create-query-tematic/create-query-tematic.component';
import { CategoryTematicComponent } from './components/tematics/category-tematic/category-tematic.component';
import { CreateCategoryTematicComponent } from './components/tematics/category-tematic/create-category-tematic/create-category-tematic.component';
import { StyleComponent } from './components/style/style.component';
import { CreateStyleComponent } from './components/style/create-style/create-style.component';
import { RolesUserComponent } from './components/user-config/roles-user/roles-user.component';
import { WorkspaceComponent } from './components/user-config/workspace/workspace.component';
import { CreateWorkspaceComponent } from './components/user-config/workspace/create-workspace/create-workspace.component';
import { ClientAppComponent } from './components/user-config/client-app/client-app.component';
import { CreateClientAppComponent } from './components/user-config/client-app/create-client-app/create-client-app.component';
import { AuthGuard } from './guards/auth-guards';
import { AdminGuard } from './guards/admin-guard';

const routes: Routes = [
  {path:'', redirectTo:global['routeTitlePage'], pathMatch: 'full'},
  {path: global['routeTitlePage'], component: TitlePageComponent},
  {path: global['routeProvider'], component: ProviderComponent, canActivate: [AdminGuard]},
  {path: global['routeCreateProvider'], component: CreateProviderComponent, canActivate: [AdminGuard]},
  {path: global['routeLayer'], component: LayerComponent, canActivate: [AdminGuard]},
  {path: global['routeCreateLayer'], component: CreateLayerComponent, canActivate: [AdminGuard]},
  {path: global['routeAlphaInfo'], component: AlphaInfoComponent, canActivate: [AdminGuard]},
  {path: global['routeCreateAlphaInfo'], component: CreateAlphaInfoComponent, canActivate: [AdminGuard]},
  {path: global['routeQueryTematic'], component: QueryTematicComponent, canActivate: [AdminGuard]},
  {path: global['routeCreateQueryTematic'], component: CreateQueryTematicComponent, canActivate: [AdminGuard]},
  {path: global['routeCategoryTematic'], component: CategoryTematicComponent, canActivate: [AdminGuard]},
  {path: global['routeStyle'], component: StyleComponent, canActivate: [AdminGuard]},
  {path: global['routeCreateStyle'], component: CreateStyleComponent, canActivate: [AdminGuard]},
  {path: global['routeCreateCategoryTematic'], component: CreateCategoryTematicComponent},
  {path: global['routeUserRoles'], component: RolesUserComponent, canActivate: [AdminGuard]},
  {path: global['routeWorkspace'], component: WorkspaceComponent, canActivate: [AuthGuard]},
  {path: global['routeCreateWorkspace'], component: CreateWorkspaceComponent, canActivate: [AuthGuard]},
  {path: global['routeClientApp'], component: ClientAppComponent, canActivate: [AuthGuard]},
  {path: global['routeCreateClientApp'], component: CreateClientAppComponent, canActivate: [AuthGuard]},

  {path: "**", redirectTo:global['routeTitlePage'], pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
