import {Component, OnInit, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import * as $ from 'jquery';
import {SearchService} from "../search.service";
import {LocalStorageService} from "../local-storage.service";
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {map, startWith} from "rxjs/operators";
import {Router, ActivatedRoute, RouterOutlet} from '@angular/router'
import { trigger, transition, group, query, style, animate } from '@angular/animations';


@Component({
  selector: 'app-search-form',
  templateUrl: './search-form.component.html',
  styleUrls: ['./search-form.component.css'],
  animations: [
    trigger('routeAnimation', [
      transition('1 => 2', [
        style({ height: '!' }),
        query(':enter', style({ transform: 'translateX(100%)' })),
        query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
        // animate the leave page away
        group([
          query(':leave', [
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(-100%)' })),
          ]),
          // and now reveal the enter
          query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)' }))),
        ]),
      ]),
      transition('2 => 1', [
        style({ height: '!' }),
        query(':enter', style({ transform: 'translateX(-100%)' })),
        query(':enter, :leave', style({ position: 'absolute', top: 0, left: 0, right: 0 })),
        // animate the leave page away
        group([
          query(':leave', [
            animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(100%)' })),
          ]),
          // and now reveal the enter
          query(':enter', animate('0.3s cubic-bezier(.35,0,.25,1)', style({ transform: 'translateX(0)' }))),
        ]),
      ]),
    ])
  ]

})
export class SearchFormComponent implements OnInit {
  profileForm = new FormGroup({
    streetFormControl: new FormControl('', Validators.required),
    cityFormControl: new FormControl('', Validators.required),
    stateFormControl: new FormControl('', Validators.required)
  });

  cityStateOptions: string[][] = [];
  cityOptions?: Observable<string[]>;
  options: string[] = [];
  stateOptions: string[] = [];
  selectedCityState: string[] = [];
  cityState?: string;
  weather_card: any;
  location: string = "";
  searchButtonClicked? = false;
  progress: boolean = false;
  location_detail?: string;
  clearButtonClicked: boolean = false;
  failedSearch: boolean = true;

  disableInputError?:boolean= false;
  @ViewChild('resultsTab', {static: true}) ResultsTab!: ElementRef
  @ViewChild('favoritesTab', {static: true}) FavoritesTab!: ElementRef

  streetInputError: boolean = false;
  cityInputError: boolean= false;

  constructor(private router: Router, private route: ActivatedRoute, private http: HttpClient, private searchService: SearchService, private localStorageService: LocalStorageService) {
  };

  _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    // this.cityStateOptions = [];
    this.options = [];
    this.searchService.getCityData(filterValue).subscribe(data => {
      var result: any = data;
      for (let i in result.predictions) {
        let theCityState: [string, string] = [result.predictions[i].terms[0].value, result.predictions[i].terms[1].value];
        this.cityStateOptions.push(theCityState);
        this.options.push(result.predictions[i].terms[0].value!);
      }
    }, (error) => {
      console.log(error);
    });
    return this.options;
    // return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  async ngOnInit(): Promise<void> {
    this.localStorageService.watchStorage().subscribe(change => {
      if (this.localStorageService.getLocalStorage('clickFavoriteCityOrState') != null) {
        console.log("the search-form component detects the click the favorite item")
        this.ResultsTab.nativeElement.classList.add('active')
        this.FavoritesTab.nativeElement.classList.remove('active')
        this.localStorageService.removeLocalStorage("clickFavoriteCityOrState")
      }
    })


    this.cityOptions = this.profileForm.get("cityFormControl")?.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }


  selectCity(option: string) {
    console.log(this.cityStateOptions)
    console.log(option)
    for (let k = 0; k < this.cityStateOptions.length; k++) {
      if (this.cityStateOptions[k][0] == option) {
        this.selectedCityState[0] = option;
        this.selectedCityState[1] = this.cityStateOptions[k][1];
        console.log(this.selectedCityState[1])
        this.profileForm.patchValue({
          stateFormControl: this.selectedCityState[1]
        })
      }
    }
  }


  clickClearButton() {
    this.disableInputError = true;
    this.searchButtonClicked = false;
    this.clearButtonClicked = true;
    this.progress = false;
    this.failedSearch = true;
    //clear and disable all elements in form

    this.profileForm.controls['streetFormControl'].enable();
    this.profileForm.controls['streetFormControl'].setValue("");
    this.profileForm.controls['cityFormControl'].setValue("");
    this.profileForm.controls['cityFormControl'].enable();
    this.profileForm.controls['stateFormControl'].setValue("");
    this.profileForm.controls['stateFormControl'].enable();
    (document.getElementById("local-location") as HTMLInputElement).checked = false;
    //clear localstorage location and latlng
    this.localStorageService.removeLocalStorage("location");
    this.localStorageService.removeLocalStorage("latlng");
    this.localStorageService.removeLocalStorage("weatherjson");

    this.ResultsTab.nativeElement.classList.add('active')
    this.FavoritesTab.nativeElement.classList.remove('active')
    this.router.navigate(["/"]);

    // this.router.navigate(["/showweather"],{queryParams: {id: this.location}});

    // $(".showWeather").css("display", "none");
    // document.getElementById() won't be able to return a specific element type since it doesn't know in advance what that element will be, so you need to cast the result as an HTMLInputElement after the fact so that the value property of that class can be recognized.
  }


  async clickSearchButton(): Promise<void> {
    this.searchButtonClicked = true;
    this.clearButtonClicked = false;
    this.progress = true;
    this.ResultsTab.nativeElement.classList.add('active')
    this.FavoritesTab.nativeElement.classList.remove('active')
    if ((document.getElementById("local-location") as HTMLInputElement).checked) {
      //call local location api
      this.http.get('https://ipinfo.io/?token=9f4945ee82ca76').subscribe(data1 => {
        // console.log(data1);
        var data: any = data1;
        let location_lat_lng = data.loc;
        this.location_detail = data.city + ',' + data.region;
        console.log(data)
        this.cityState = data.city + ',' + data.region;
        // console.log(location_lat_lng)
        this.location = location_lat_lng;
        console.log(this.location)
        console.log(this.location_detail)
        this.localStorageService.setLocalStorage( //store location
          'latlng',
          this.location
        )
        this.localStorageService.setLocalStorage( //store location
          'location',
          this.location_detail
        )
        if (this.location != null) {
          $.ajax({
            url: 'https://csci571yuanbackend.wl.r.appspot.com/chart?id=' + this.location,
            type: "GET",

            dataType: 'json',
            async: true,
            cache: false,

            success: (result) => {
              // weather_card = data;

              this.localStorageService.setLocalStorage(
                'meteogramData',
                result.data.timelines[0].intervals
              );

            },
            error: (error) => {
              this.failedSearch = false;
              console.log(error);
            }
          })

          $.ajax({
            url: 'https://csci571yuanbackend.wl.r.appspot.com/api?id=' + this.location,
            type: "GET",

            dataType: 'json',
            async: true,
            cache: false,

            success: (result) => {
              // weather_card = data;
              this.weather_card = result;
              this.localStorageService.setLocalStorage(
                'weatherjson',
                this.weather_card.data.timelines[0].intervals
              );
              if (this.localStorageService.getLocalStorage("weatherjson") != null && this.localStorageService.getLocalStorage("meteogramData") != null) {
                this.progress = false;
                this.router.navigate(['/showweather'], {queryParams: {id: this.location}})
              }
            },
            error: (error) => {
              this.failedSearch = false;
              console.log(error);
            }
          })

        }
      }, (error) => {
        this.failedSearch = false;
        console.log(error);
      });

    } else {
      //use input locations

      let street = this.profileForm.controls['streetFormControl'].value;
      let city = this.profileForm.controls['cityFormControl'].value;

      let state = this.profileForm.controls['stateFormControl'].value;
      let locationInfo = street + city + state;
      this.location_detail = city + ',' + state + ',' + street;
      console.log("location detail", this.location_detail)
      // this.cityState = this.profileForm.controls['cityFormControl'].value + this.profileForm.controls['stateFormControl'].value;
      $.ajax({
        url: "https://csci571yuanbackend.wl.r.appspot.com/location?id=" + this.location_detail ,
        type: "GET",
        dataType: 'json',
        async: true,
        cache: false,
        success: (data) => {
          let location1 = (data.results)[0].geometry.location;
          this.location = location1.lat + ',' + location1.lng;
          // weather_card = data;
          this.localStorageService.setLocalStorage( //store location
            'latlng',
            this.location
          )
          this.localStorageService.setLocalStorage( //store location
            'location',
            this.location_detail
          )

          $.ajax({
            url: 'https://csci571yuanbackend.wl.r.appspot.com/chart?id=' + this.location,
            type: "GET",

            dataType: 'json',
            async: true,
            cache: false,

            success: (result) => {
              // weather_card = data;

              this.localStorageService.setLocalStorage(
                'meteogramData',
                result.data.timelines[0].intervals
              );

            },
            error: (error) => {
              this.failedSearch = false;
              console.log(error);
            }
          })

          $.ajax({
            url: 'https://csci571yuanbackend.wl.r.appspot.com/api?id=' + this.location,
            type: "GET",

            dataType: 'json',
            async: true,
            cache: false,

            success: (result) => {
              // weather_card = data;
              this.weather_card = result;
              this.localStorageService.setLocalStorage(
                'weatherjson',
                this.weather_card.data.timelines[0].intervals
              )
              if (this.localStorageService.getLocalStorage("weatherjson") != null && this.localStorageService.getLocalStorage("meteogramData") != null) {
                this.progress = false;
                this.router.navigate(['/showweather'], {queryParams: {id: this.location}})
              }
            },
            error: (error) => {
              this.failedSearch = false;
              console.log(error);
            }
          })
        },
        error: (error) => {
          this.failedSearch = false;
          console.log(error);
        }
      })
    }
  }

  currentLocationIsChecked: boolean = false; //the current location checkbox is checked
  //way1: not use event
  getCurrentLocation() {
    this.disableInputError = true;
    this.currentLocationIsChecked = !this.currentLocationIsChecked;
    let el = document.getElementById("local-location") as HTMLInputElement;
    if (el.checked) {
      // this.profileForm.controls['streetFormControl'].setValue("");
      this.profileForm.controls['streetFormControl'].disable();
      // this.profileForm.controls['cityFormControl'].setValue("");
      this.profileForm.controls['cityFormControl'].disable();
      // this.profileForm.controls['stateFormControl'].setValue("");
      this.profileForm.controls['stateFormControl'].disable();
    } else {
      // this.profileForm.controls['streetFormControl'].setValue("");
      this.profileForm.controls['streetFormControl'].enable();
      // this.profileForm.controls['cityFormControl'].setValue("");
      this.profileForm.controls['cityFormControl'].enable();
      // this.profileForm.controls['stateFormControl'].setValue("");
      this.profileForm.controls['stateFormControl'].enable();
    }
    //way2:use event.target.value
    //specify the type yourself. HTMLInputElement
    // this.currentLocationIsChecked = (<HTMLInputElement>event.target).checked;
    // if(this.currentLocationIsChecked) {
    //   let loaLo = document.getElementById("local-location");
    //   this.profileForm.controls['streetFormControl'].setValue("");
    //   this.profileForm.controls['streetFormControl'].disable();
    //   this.profileForm.controls['cityFormControl'].setValue("");
    //   this.profileForm.controls['cityFormControl'].disable();
    //   this.profileForm.controls['stateFormControl'].setValue("");
    //   this.profileForm.controls['stateFormControl'].disable();
    // }
  }

  showResults() {
    if (this.localStorageService.getLocalStorage("location") != null) {
      this.router.navigate(['/showweather'], {queryParams: {id: this.localStorageService.getLocalStorage("latlng")}})
    } else { // already clear all data
      this.router.navigate(["/"]);
    }
  }

  showFavorites() {
    this.router.navigate(['/showfavorites']);
  }


  detectStreetError() {
    if(this.profileForm.controls['streetFormControl'].errors?.required && this.profileForm.controls['streetFormControl'].invalid && (this.profileForm.controls['streetFormControl'].dirty || this.profileForm.controls['streetFormControl'].touched)) {
      this.streetInputError = true;
    }else{
      this.streetInputError = false;
    }
  }

  detectCityError() {
    if(this.profileForm.controls['cityFormControl'].errors?.required && this.profileForm.controls['cityFormControl'].invalid && (this.profileForm.controls['cityFormControl'].dirty || this.profileForm.controls['cityFormControl'].touched)) {
      this.cityInputError = true;
    }else{
      this.cityInputError = false;
    }
  }

  getDepth(outlet: RouterOutlet) {
    return outlet.activatedRouteData['depth'];
  }
}
