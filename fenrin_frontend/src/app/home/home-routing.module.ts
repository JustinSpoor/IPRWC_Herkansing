import {RouterModule, Routes} from "@angular/router";
import {HomePageComponent} from "./home-page/home-page.component";
import {NgModule} from "@angular/core";

export const homeRoutes: Routes = [
  {
    path: 'home',
    component: HomePageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(homeRoutes)],
  exports: [RouterModule]
})

export class HomeRoutingModule {}
