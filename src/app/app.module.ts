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
import { ListQueriesComponent } from './components/query-tematic/create/list-queries/list-queries.component';
import { CreateTematicComponent } from './components/query-tematic/create/create-tematic/create-tematic.component';

import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { CreateComponent } from './components/query-tematic/create/create.component';
import { CategoryTematicComponent } from './components/category-tematic/category-tematic.component';
import { CreateCategoryTematicComponent } from './components/category-tematic/create-category-tematic/create-category-tematic.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginUserComponent,
    RegisterUserComponent,
    PageNotFoundComponent,
    TitlePageComponent,
    QueryTematicComponent,
    ListQueriesComponent,
    CreateTematicComponent,
    FooterComponent,
    HeaderComponent,
    CreateComponent,
    CategoryTematicComponent,
    CreateCategoryTematicComponent
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
