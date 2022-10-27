import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginUserComponent } from './components/authentication/login-user/login-user.component';
import { RegisterUserComponent } from './components/authentication/register-user/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './components/others/page-not-found/page-not-found.component';
import { TitlePageComponent } from './components/others/title-page/title-page.component';
import { QueryTematicComponent } from './components/tematics/query-tematic/query-tematic.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/others/footer/footer.component';
import { HeaderComponent } from './components/others/header/header.component';
import { CategoryTematicComponent } from './components/tematics/category-tematic/category-tematic.component';
import { CreateCategoryTematicComponent } from './components/tematics/category-tematic/create-category-tematic/create-category-tematic.component';
import { CreateQueryTematicComponent } from './components/tematics/query-tematic/create-query-tematic/create-query-tematic/create-query-tematic.component';
import { ProviderComponent } from './components/provider/provider.component';
import { CreateProviderComponent } from './components/provider/create-provider/create-provider.component';
import { LayerComponent } from './components/layer/layer.component';
import { CreateLayerComponent } from './components/layer/create-layer/create-layer.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatSidenavModule} from '@angular/material/sidenav';

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    RegisterUserComponent,
    PageNotFoundComponent,
    TitlePageComponent,
    QueryTematicComponent,
    FooterComponent,
    HeaderComponent,
    CategoryTematicComponent,
    CreateCategoryTematicComponent,
    CreateQueryTematicComponent,
    ProviderComponent,
    CreateProviderComponent,
    LayerComponent,
    CreateLayerComponent
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
    MatSidenavModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
