import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ShowWeatherComponent} from "./show-weather/show-weather.component";
import {ShowFavoritesComponent} from "./show-favorites/show-favorites.component";
import {WeatherDetailComponent} from "./weather-detail/weather-detail.component";

const routes: Routes = [
  {path: 'showweather', component : ShowWeatherComponent, data: {depth: 1}},
  {path: 'showfavorites', component: ShowFavoritesComponent},
  {path: 'weatherdetail', component:  WeatherDetailComponent, data: {depth: 2}}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
