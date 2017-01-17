import { RouterModule, Routes } from '@angular/router';
import { NgModule, ModuleWithProviders } from '@angular/core' ;
import { RootComponent } from './components/root/root.component';

const routes: ModuleWithProviders = RouterModule.forRoot([
   { path: '',
        component: RootComponent
        // children: [
        // { path: '', component: Notes },
        // { path: 'about', component: About }
        // ]
    },
    { path: '**', redirectTo: '' }
]);

@NgModule({
  imports: [ routes ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}