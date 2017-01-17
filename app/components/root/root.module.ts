import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppRoutingModule } from '../../routes';

import { RootComponent } from './root.component';
import { LoginComponent } from '../login/login.component';
import { HomeComponent } from '../home/home.component';
import { SignupComponent } from '../signup/signup.component';

import './rxjs-extensions';

@NgModule({
  declarations: [
    RootComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [RootComponent]
})
export class RootModule { }