import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { TitlePageComponent } from './components/title-page/title-page.component';
import { QueryTematicComponent } from './components/query-tematic/query-tematic.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { CategoryTematicComponent } from './components/category-tematic/category-tematic.component';
import { CreateCategoryTematicComponent } from './components/category-tematic/create-category-tematic/create-category-tematic.component';
import { CreateQueryTematicComponent } from './components/query-tematic/create-query-tematic/create-query-tematic/create-query-tematic.component';
import { ProviderComponent } from './components/provider/provider.component';

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
    ProviderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
