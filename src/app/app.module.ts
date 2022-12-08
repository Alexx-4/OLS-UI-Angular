import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { TitlePageComponent } from './components/others/title-page/title-page.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/others/footer/footer.component';
import { HeaderComponent } from './components/others/header/header.component';
import { ProviderComponent } from './components/provider/provider.component';
import { CreateProviderComponent } from './components/provider/create-provider/create-provider.component';
import { LayerComponent } from './components/layer/layer.component';
import { CreateLayerComponent } from './components/layer/create-layer/create-layer.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';


import { MatFormFieldModule } from '@angular/material/form-field';
import {MatMenuModule} from '@angular/material/menu';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatRadioModule} from '@angular/material/radio';
import { AlphaInfoComponent } from './components/alpha-info/alpha-info.component';
import { CreateAlphaInfoComponent } from './components/alpha-info/create-alpha-info/create-alpha-info.component';
import { QueryTematicComponent } from './components/tematics/query-tematic/query-tematic.component';
import { CreateQueryTematicComponent } from './components/tematics/query-tematic/create-query-tematic/create-query-tematic.component';
import { CategoryTematicComponent } from './components/tematics/category-tematic/category-tematic.component';
import { StyleComponent } from './components/style/style.component';
import { CreateStyleComponent } from './components/style/create-style/create-style.component';
import { CreateCategoryTematicComponent } from './components/tematics/category-tematic/create-category-tematic/create-category-tematic.component';
import { RolesUserComponent } from './components/user-config/roles-user/roles-user.component';
import { WorkspaceComponent } from './components/user-config/workspace/workspace.component';
import { ClientAppComponent } from './components/user-config/client-app/client-app.component';
import { CreateClientAppComponent } from './components/user-config/client-app/create-client-app/create-client-app.component';
import { CreateWorkspaceComponent } from './components/user-config/workspace/create-workspace/create-workspace.component';

import { JwtModule } from "@auth0/angular-jwt";
import { NgxSpinnerModule } from "ngx-spinner";

import { AuthGuard } from './guards/auth-guards';
import { AuthenticationComponent } from './components/user-config/authentication/authentication.component';
import { AdminGuard } from './guards/admin-guard';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    TitlePageComponent,
    FooterComponent,
    HeaderComponent,
    ProviderComponent,
    CreateProviderComponent,
    LayerComponent,
    CreateLayerComponent,
    AlphaInfoComponent,
    CreateAlphaInfoComponent,
    QueryTematicComponent,
    CreateQueryTematicComponent,
    CategoryTematicComponent,
    StyleComponent,
    CreateStyleComponent,
    CreateCategoryTematicComponent,
    RolesUserComponent,
    WorkspaceComponent,
    ClientAppComponent,
    CreateClientAppComponent,
    CreateWorkspaceComponent,
    AuthenticationComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    MatFormFieldModule,
    MatSelectModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatPaginatorModule,
    MatIconModule,
    MatRadioModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5001"],
        disallowedRoutes: []
      }
    }),
    MatMenuModule
  ],
  providers: [AuthGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
