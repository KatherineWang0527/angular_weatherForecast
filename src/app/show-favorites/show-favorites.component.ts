import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {LocalStorageService} from "../local-storage.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-show-favorites',
  templateUrl: './show-favorites.component.html',
  styleUrls: ['./show-favorites.component.css']
})
export class ShowFavoritesComponent implements OnInit {
  constructor(private localStorageService: LocalStorageService, private router: Router) { }
  localStorageArray : string[][] = [];
  storageIndex: number = 0;
  ngOnInit(): void {
    //遍历本地存储localStorage
    for (var i = 0; i < this.localStorageService.localStorage.length; i++) {
      var key = this.localStorageService.localStorage.key(i); //获取本地存储的Key
      console.log("key is:"+ key);
      //except other none-favorite condition
      if(key != null && key != "weatherjson" && key != "location" && key != "latlng" && key != "selectFavoriteIntervalWeather" && key !="clickFavoriteCityOrState" && key != "showWeatherItem" && key != "meteogramData") {
        let s: string = this.localStorageService.getLocalStorage(key)![0];//s: seletedCityState
        console.log("local storage city and state:"+s);
        // this.localstorageService.setLocalStorage(id, [this.selectedCityState, this.intervals_weather])
        this.localStorageArray.push([key, s.split(",")[0],s.split(",")[1], this.localStorageService.getLocalStorage(key)[1], s]);
        //[latlng, city, state, json(interval_weathers), cityState]
      }
    }
  }

  deleteTheFavorite(i: number) {
    //the index i in the localStorageArray
    //and then get the key
    var key = this.localStorageArray[i][0];
    this.localStorageService.removeLocalStorage(key);
    this.localStorageArray.splice(i,1);
  }


  showDetail(i: number) {
    // this.weatherIndex = i;
    this.localStorageService.removeLocalStorage("selectFavoriteIntervalWeather");
    var latlng = this.localStorageArray[i][0];
    let selectFavoriteJson = this.localStorageArray[i][3];
    let selectedCityState = this.localStorageArray[i][4];
    this.localStorageService.setLocalStorage("selectFavoriteIntervalWeather", [selectFavoriteJson, selectedCityState,latlng]);
    this.localStorageService.setLocalStorage("clickFavoriteCityOrState", true);

    this.router.navigate(["/showweather"], {queryParams: {id: latlng}});
  }
}
