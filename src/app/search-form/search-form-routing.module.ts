import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShowWeatherComponent} from "../show-weather/show-weather.component";

const routes: Routes = [
  // {path:"", redirectTo: "/showweather", pathMatch: "full"},
  // {path: 'showweather/:id', component : ShowWeatherComponent},

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchFormRoutingModule { }
