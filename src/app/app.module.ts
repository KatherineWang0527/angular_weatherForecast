import {FactoryProvider, InjectionToken, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SearchFormComponent} from './search-form/search-form.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ShowWeatherComponent} from './show-weather/show-weather.component';
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {HttpClientModule} from "@angular/common/http";
import {MatInputModule} from "@angular/material/input";
import {HighchartsChartModule} from "highcharts-angular";
import {RouterModule} from "@angular/router";
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import exporting from 'highcharts/modules/exporting.src';
import windbarb from 'highcharts/modules/windbarb.src';
import {MatIconModule} from "@angular/material/icon";
import { ShowFavoritesComponent } from './show-favorites/show-favorites.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {AgmCoreModule} from "@agm/core";
import { WeatherDetailComponent } from './weather-detail/weather-detail.component';


export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [ exporting,windbarb ];
}



@NgModule({
  declarations: [
    AppComponent,
    SearchFormComponent,
    ShowWeatherComponent,
    ShowFavoritesComponent,
    WeatherDetailComponent,
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        NgbModule,
        RouterModule,
        BrowserAnimationsModule,
        AgmCoreModule.forRoot({
          apiKey: 'AIzaSyBhurAdAyM56-tvBQikX8JnUE-c9cYr-b8'
        }),
        ReactiveFormsModule,
        MatAutocompleteModule,
        HighchartsChartModule,
        HttpClientModule,
        FormsModule,
        ChartModule,
        MatInputModule,
        MatIconModule,
        AgmCoreModule
    ],
  // , { provide: [HIGHCHARTS_MODULES],  useFactory: highchartsModules}
  providers:  [{ provide: [HIGHCHARTS_MODULES],  useFactory: highchartsModules}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
