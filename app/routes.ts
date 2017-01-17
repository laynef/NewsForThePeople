import { RouterModule, Routes } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core' ;
import { RootComponent } from './components/root/root.component';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
    { path: '', redirectTo: '/signup', pathMatch: 'full' },
    {path: '', component: RootComponent},
    { path: 'home',  component: HomeComponent },
    { path: 'signup',  component: SignupComponent },
    { path: 'login',  component: LoginComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}