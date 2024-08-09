import { Routes } from '@angular/router';
import { StartComponent } from './routing/start/start.component.js';
import { FirstComponent } from './routing/first/first.component.js';
import { SecondComponent } from './routing/second/second.component.js';
import { PageNotFoundComponent } from './routing/page-not-found/page-not-found.component.js';

export const routes: Routes = [

  {
    path:'start',
    component:StartComponent
  }
  ,
  {
    path:'first',
    component:FirstComponent
  }
  ,
  {
    path:'second',
    component:SecondComponent
  }
  ,
  {
    path:'',
    redirectTo:'start',
    pathMatch: 'full'
  }
  ,
  {
    path:'**',
    component:PageNotFoundComponent
  }

];