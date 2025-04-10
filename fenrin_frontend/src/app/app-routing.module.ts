import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PageNotFoundComponent} from "./error/page-not-found/page-not-found.component";
import { homeRoutes } from './home/home-routing.module'
import {loginRoutes} from "./login/login-routing.module";
import {aboutRoutes} from "./about/about-routing.module";



const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      },
      ...homeRoutes,
      ...aboutRoutes,
      ...loginRoutes,
      {
        path: '**',
        component: PageNotFoundComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
