import {Component, Inject, Input, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {ActivatedRoute, Router} from "@angular/router";
import * as Highcharts from 'highcharts';
import {HTMLDOMElement} from "highcharts";
import {SearchService} from "../search.service";
import {LocalStorageService} from "../local-storage.service";
import * as highchartsStock from 'highcharts/modules/stock';
import more from 'highcharts/highcharts-more';

more(Highcharts);
import item from 'highcharts/modules/item-series';

item(Highcharts);
import highchartsWindbarb from 'highcharts/modules/windbarb';


highchartsWindbarb(Highcharts);


var weatherCodeMap = new Map();
weatherCodeMap.set(4201, ["../assets/static/Images/Weather Symbols for Weather Codes/rain_heavy.svg", "Heavy Rain"]);
weatherCodeMap.set(4001, ["../assets/static/Images/Weather Symbols for Weather Codes/rain.svg", "Rain"]);
weatherCodeMap.set(4200, ["../assets/static/Images/Weather Symbols for Weather Codes/rain_light.svg", "Light Rain"]);
weatherCodeMap.set(6201, ["./assets/static/Images/Weather Symbols for Weather Codes/freezing_rain_heavy.svg", "Heavy Freezing Rain"]);
weatherCodeMap.set(6001, ["./assets/static/Images/Weather Symbols for Weather Codes/freezing_rain.svg", "Freezing Rain"]);
weatherCodeMap.set(6200, ["./assets/static/Images/Weather Symbols for Weather Codes/freezing_rain_light.svg", "Light Freezing Rain"]);
weatherCodeMap.set(6000, ["./assets/static/Images/Weather Symbols for Weather Codes/freezing_drizzle.svg", "Freezing Drizzle"]);
weatherCodeMap.set(4000, ["./assets/static/Images/Weather Symbols for Weather Codes/drizzle.svg", "Drizzle"]);
weatherCodeMap.set(7101, ["./assets/static/Images/Weather Symbols for Weather Codes/ice_pellets_heavy.svg", "Heavy Ice Pallets"]);
weatherCodeMap.set(7000, ["./assets/static/Images/Weather Symbols for Weather Codes/ice_pellets.svg", "Ice pallets"]);
weatherCodeMap.set(7102, ["./assets/static/Images/Weather Symbols for Weather Codes/ice_pellets_light.svg", "Light Ice Pallets"]);
weatherCodeMap.set(5101, ["./assets/static/Images/Weather Symbols for Weather Codes/snow_heavy.svg", "Heavy Snow"]);
weatherCodeMap.set(5000, ["./assets/static/Images/Weather Symbols for Weather Codes/snow.svg", "Snow"]);
weatherCodeMap.set(5100, ["./assets/static/Images/Weather Symbols for Weather Codes/snow_light.svg", "Light Snow"]);
weatherCodeMap.set(5001, ["./assets/static/Images/Weather Symbols for Weather Codes/flurries.svg", "Flurries"]);
weatherCodeMap.set(8000, ["./assets/static/Images/Weather Symbols for Weather Codes/tstorm.svg", "Thundersotrm"]);
weatherCodeMap.set(2100, ["./assets/static/Images/Weather Symbols for Weather Codes/fog_light.svg", "Light Fog"]);
weatherCodeMap.set(2000, ["/./assets/static/Images/Weather Symbols for Weather Codes/fog.svg", "Fog"]);
weatherCodeMap.set(1001, ["./assets/static/Images/Weather Symbols for Weather Codes/cloudy.svg", "Cloudy"]);
weatherCodeMap.set(1102, ["./assets/static/Images/Weather Symbols for Weather Codes/mostly_cloudy.svg", "Mostly Cloudy"]);
weatherCodeMap.set(1101, ["./assets/static/Images/Weather Symbols for Weather Codes/partly_cloudy_day.svg", "Partly Cloudy"]);
weatherCodeMap.set(1100, ["./assets/static/Images/Weather Symbols for Weather Codes/mostly_clear_day.svg", "Mostly Clear"]);
weatherCodeMap.set(1000, ["./assets/static/Images/Weather Symbols for Weather Codes/clear_day.svg", "Clear, Sunny"]);

var dayMap = new Map();
dayMap.set(1, "Monday");
dayMap.set(2, "Tuesday")
dayMap.set(3, "Wednesday");
dayMap.set(4, "Thursday");
dayMap.set(5, "Friday");
dayMap.set(6, "Saturday");
dayMap.set(0, "Sunday");

//transfer number month to alpha month
var monMap = new Map();
monMap.set(1, "Jan");
monMap.set(2, "Feb");
monMap.set(3, "Mar");
monMap.set(4, "Apr");
monMap.set(5, "May");
monMap.set(6, "Jun");
monMap.set(7, "Jul");
monMap.set(8, "Aug");
monMap.set(0, "Sep");
monMap.set(10, "Oct");
monMap.set(11, "Nov");
monMap.set(12, "Dec");

interface Weather {
  // id: number;
  imgSrc: string;
  date: string;
  status: string;
  maxTemp: string;
  minTemp: string;
  apparentTemp: string;
  sunRiseTime: string;
  sunSetTime: string;
  humidity: string;
  windSpeed: string;
  visibility: string;
  cloudCover: string;
}


@Component({
  selector: 'app-show-weather',
  templateUrl: './show-weather.component.html',
  styleUrls: ['./show-weather.component.css']
})


export class ShowWeatherComponent implements OnInit {
  // container: (string | HTMLDOMElement) = "container";
  winds ?: any;
  temperatures ?: any;
  airPressure ?: any;
  json ?: any;
  container?: any;
  humidity?: any;
  // constructor( @Inject(WINDOW) private window: Window )
  chart?: any;
  resolution = window.innerWidth * window.innerHeight;
  selectedLat?: number;
  selectedLng ?: number;
  twitterText?: string;
  twitterUrl?: string;
  showLocation: any;
  clickFavoriteStar: boolean = false;
  items: boolean[] = [];
  enableDetails: boolean = false;

  constructor(private searchService: SearchService, private router: Router, private route: ActivatedRoute, private localstorageService: LocalStorageService) {
    // @Inject(WINDOW) private window: Window,
  }

  theWeatherCodeMap = weatherCodeMap;
  location!: string;

  seletedWeather?: any;
  tableWeather?: Weather[];
  selectedCityState: any;

  weatherIndex: number = 0;
  intervals_weather: any[] = [];

  showWeatherDetail(num: number) {
    this.enableDetails = true;
    // this.weatherIndex = num;
    this.localstorageService.setLocalStorage("showWeatherItem", [this.intervals_weather[num], this.twitterText, this.selectedLat, this.selectedLng, num]);
    this.router.navigate(["weatherdetail"])
  }

  async ngOnInit(): Promise<void> {
    if (this.localstorageService.getLocalStorage("selectFavoriteIntervalWeather") != null) {//click a city or state item from favorite lists
      console.log("the show-weather component detects the click the favorite item")
      this.intervals_weather = this.localstorageService.getLocalStorage("selectFavoriteIntervalWeather")[0];
      this.selectedCityState = this.localstorageService.getLocalStorage("selectFavoriteIntervalWeather")[1];
      this.localstorageService.removeLocalStorage("selectFavoriteIntervalWeather");
      //delete the localStorage selectFavoriteIntervalWeather info, because if not delete, always go into the if function
    } else {
      this.selectedCityState = this.localstorageService.getLocalStorage("location");
      this.intervals_weather = this.localstorageService.getLocalStorage("weatherjson");
      // console.log("the interval weather is:" + this.intervals_weather);
    }

    if (this.localstorageService.getLocalStorage("showWeatherItem") != null) {
      this.enableDetails = true;
      this.weatherIndex = this.localstorageService.getLocalStorage("showWeatherItem")[4];
    }

    this.route.queryParams.subscribe(params => {
      this.location = params['id']!;
    });
    this.clickFavoriteStar = this.localstorageService.getLocalStorage(this.location) != null;

    this.selectedLat = +this.location.split(",")[0]!;
    this.selectedLng = +this.location.split(",")[1]!;
    // console.log("lat:" + this.selectedLat + "; lng:" + this.selectedLng);
    // console.log("location in showweather component:" + this.location)
    // console.log("this.localstorageService.getLocalStorage(\"weatherjson\") is:" + this.localstorageService.getLocalStorage("weatherjson"))


    // console.log("this.selectedCityState" + this.selectedCityState)
    if (this.selectedCityState.split(",").length == 3) {
      let city = this.selectedCityState.split(",")[0];
      let state = this.selectedCityState.split(",")[1];
      let street = this.selectedCityState.split(",")[2];
      this.showLocation = street + ", " + city + ", " + state;
    } else {
      this.showLocation = this.selectedCityState.split(",")[0] + ', ' + this.selectedCityState.split(",")[1];
    }
    // console.log("intervals_weather in showweather component:" + this.intervals_weather)
    //dynamically change the static weather.html
    this.twitterText = "The temperature in " + this.selectedCityState + " on " + this.getTheDate(this.intervals_weather[this.weatherIndex]?.startTime?.toString())
      + " is " + this.intervals_weather[this.weatherIndex]?.values.temperature + "°F. The weather conditions " +
      "are mostly " + this.theWeatherCodeMap.get(this.intervals_weather[this.weatherIndex]?.values.weatherCode)[1];
    this.twitterUrl = "#CSCI571WeatherForecast";


    const timeArray = [];
    for (let index = 0; index < 15; index++) {
      let array = [];
      let time = new Date(this.intervals_weather[index].startTime).getTime()
      let minTemp = this.intervals_weather[index]?.values?.temperatureMin;
      let maxTemp = this.intervals_weather[index].values.temperatureMax;
      array = [time, minTemp, maxTemp];
      timeArray.push(array);
    }
    // console.log("timeArray:", timeArray);

    //first chart temperature range

    (Highcharts.chart as any)("container", {
      // Highcharts.chart('container', {
      // $('#container').highcharts({
      chart: {
        type: 'arearange',
        zoomType: 'x',
        scrollablePlotArea: {
          minWidth: 600,
          scrollPositionX: 1
        }
      },

      title: {
        text: 'Temperature Ranges(Min, Max)'
      },

      xAxis: {
        type: 'datetime',
        labels: {format: '{value:%d %b}'},
        tickInterval: 24 * 3600 * 1000,
        accessibility: {
          rangeDescription: 'Range: current to next 15 days.'
        }
      },

      yAxis: {
        labels: {},
        title: {
          text: null
        }
      },

      tooltip: {
        // crosshairs: true,
        shared: true,
        valueSuffix: '°C',
        xDateFormat: '%A, %b %e'
      },

      legend: {
        enabled: false
      },
      plotOptions: {
        series: {
          marker: {
            fillColor: '#6ea3f7'
          }
        }
      },

      series: [{
        name: 'Temperatures',
        data: timeArray,
        lineColor: '#ffad33',
        color: {
          linearGradient: {x1: 0, x2: 0, y1: 0, y2: 1},

          stops: [
            [0, '#ffad33'],
            [0.5, '#e6f2ff'],
            [1, '#99ccff'],

          ]
        },
        lineWidth: 2
      }],
    });


    // await this.searchService.callChart(this.location).subscribe(data => {
    //   console.log("json data:", data)
    this.Meteogram(this.localstorageService.getLocalStorage("meteogramData"), 'container2');

    // });

  }


  Meteogram(this: any, json: any, container: any) {
    this.winds = [];
    this.temperatures = [];
    this.airPressure = [];
    this.humidity = [];
    // Initialize
    this.json = json;
    this.container = container;

    // Run
    // this.parseYrData();
    this.parseYrData();
  }


  /**
   * Draw blocks around wind arrows, below the plot area
   */


  drawBlocksForWindArrows(chart: any) {
    const xAxis = chart.xAxis[0];

    for (
      let pos = xAxis.min, max = xAxis.max, i = 0;
      pos <= max + 36e5; pos += 36e5,
        i += 1
    ) {

      // Get the X position
      const isLast = pos === max + 36e5,
        x = Math.round(xAxis.toPixels(pos)) + (isLast ? 0.5 : -0.5);

      // Draw the vertical dividers and ticks
      const isLong = this.resolution > 36e5 ?
        pos % this.resolution === 0 :
        i % 2 === 0;

      chart.renderer
        .path([
          'M', x, chart.plotTop + chart.plotHeight + (isLong ? 0 : 28),
          'L', x, chart.plotTop + chart.plotHeight + 32,
          'Z'
        ])
        .attr({
          stroke: chart.options.chart.plotBorderColor,
          'stroke-width': 1
        })
        .add();
    }

    // Center items in block
    chart.get('windbarbs').markerGroup.attr({
      translateX: chart.get('windbarbs').markerGroup.translateX + 8
    });

  };

  /**
   * Build and return the Highcharts options structure
   */
  getChartOptions() {
    return {
      chart: {
        renderTo: this.container,
        marginBottom: 70,
        marginRight: 40,
        marginTop: 50,
        plotBorderWidth: 1,
        height: 310,
        alignTicks: false,
        scrollablePlotArea: {
          minWidth: 720
        }
      },

      title: {
        text: 'Hourly weather(For Next 5 Days)',
        align: 'center',
        style: {
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis'
        }
      },


      tooltip: {
        shared: true,
        useHTML: true,
        headerFormat:
          '<small>{point.x:%A, %b %e, %H:%M} - {point.point.to:%H:%M}</small><br>' +
          '<b>{point.point.symbolName}</b><br>'

      },

      xAxis: [{ // Bottom X axis
        type: 'datetime',
        tickInterval: 4 * 36e5, // two hours
        minorTickInterval: 36e5, // one hour
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        offset: 30,
        showLastLabel: true,
        labels: {
          format: '{value:%H}'
        },
        crosshair: true
      }, { // Top X axis
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
          align: 'left',
          x: 3,
          y: -5
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1
      }],

      yAxis: [{ // temperature axis
        title: {
          text: null
        },
        labels: {
          format: '{value}°',
          style: {
            fontSize: '10px'
          },
          x: -3
        },
        plotLines: [{ // zero plane
          value: 0,
          color: '#BBBBBB',
          width: 1,
          zIndex: 2
        }],
        maxPadding: 0.3,
        minRange: 8,
        tickInterval: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)'

      }, { // pressure axis
        title: { // Title on top of axis
          text: 'inHg',
          offset: 0,
          align: 'high',
          rotation: 0,
          style: {
            fontSize: '10px',
            color: '#fcba03'
          },
          textAlign: 'left',
          x: 3
        },
        opposite: true,
        labels: {
          style: {
            fontSize: '8px',
            color: '#fcba03'
          },
          y: 2,
          x: 3
        },
        showLastLabel: false,
      }],

      legend: {
        enabled: false
      },

      plotOptions: {
        series: {
          pointPlacement: 'between'
        }
      },


      series: [{
        name: 'Temperature',
        data: this.temperatures,
        type: 'spline',
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        tooltip: {
          valueSuffix: ' °'
        },
        zIndex: 1,
        color: '#FF3333',

        negativeColor: '#48AFE8'
      }, {
        name: 'airPressure',
        data: this.airPressure,
        type: 'spline',
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: true
            }
          }
        },
        dashStyle: 'shortdot',
        tooltip: {
          valueSuffix: ' inHg'
        },
        zIndex: 1,
        color: '#fcba03',
        negativeColor: '#48AFE8'
      }, {
        name: 'Humidity',
        data: this.humidity,
        type: 'column',
        yAxis: 1,
        groupPadding: 0,
        pointPadding: 0,
        tooltip: {
          valueSuffix: ' mm'
        },
        grouping: false,
      }, {
        name: 'Wind',
        type: 'windbarb',
        id: 'windbarbs',
        // color: Highcharts.getOptions().colors[1],
        lineWidth: 1.5,
        data: this.winds,
        vectorLength: 12,
        yOffset: -15,
        tooltip: {
          valueSuffix: ' m/s'
        }
      }]
    };
  };

  /**
   * Post-process the chart from the callback function, the second argument
   * Highcharts.Chart.
   */
  onChartLoad(chart: any) {

    // this.drawWeatherSymbols(chart);
    this.drawBlocksForWindArrows(chart);
  };

  /**
   * Create the chart. This function is called async when the data file is loaded
   * and parsed.
   */
  createChart() {
    this.chart = new Highcharts.Chart(this.getChartOptions() as any, chart => {
      this.onChartLoad(chart);
    });
  };

  error() {
    document.getElementById('loading')!.innerHTML =
      '<i class="fa fa-frown-o"></i> Failed loading data, please try again later';
  };


  /**
   * Handle the data. This part of the code is not Highcharts specific, but deals
   * with yr.no's specific data format
   */
  parseYrData() {
    let pointStart: number;
    if (!this.json) {
      return this.error();
    }

    // Loop over hourly (or 6-hourly) forecasts
    // $.each(this.json.data.timelines[0].intervals, function (node, i) {
    this.json.forEach((node: any, i: number) => {

      const x = Date.parse(node.startTime);
      // to = node.data.next_1_hours ? x + 36e5 : x + 2 * 36e5;
      let to = x + 36e5;

      if (to > pointStart + 5 * 24 * 36e5) {
        return;
      }

      this.temperatures.push({
        x,
        y: node.values.temperature,
        to,
        // custom options used in the tooltip formatter
      });

      this.airPressure.push({
        x,
        y: node.values.pressureSeaLevel
      });
      this.humidity.push({
        x,
        y: node.values.humidity
      });


      if (i % 2 === 0) {
        this.winds.push({
          x,
          value: node.values.windSpeed,
          direction: node.values.windDirection
        });
      }


      if (i === 0) {
        pointStart = (x + to) / 2;
      }
    });

    // Create the chart when the data is loaded
    this.createChart();
  };

  getTheDate(date: string): string {
    let d1 = new Date(date); //2021-10-01T03:00:00Z
    let weekDate1 = d1.getDay();
    let year1 = date.split("-")[0];
    let month1 = date.split("-")[1];
    let day1 = (date.split("-")[2]).substring(0, 2);
    let theDate = dayMap.get(parseInt(weekDate1.toString())) + ", " + day1 + " " + monMap.get(parseInt(month1)) + " " + year1;
    return theDate;
  }


  addToFavorites(id: string) {
    this.clickFavoriteStar = !this.clickFavoriteStar;
    console.log(this.clickFavoriteStar)
    if (this.localstorageService.getLocalStorage(id) == null) {//add: no id in favorites list or
      console.log("add the item to Favorites")
      this.localstorageService.setLocalStorage(id, [this.selectedCityState, this.intervals_weather]);

    } else { //remove

      console.log("remove the item from Favorites")
      this.localstorageService.removeLocalStorage(id);
    }
  }

  deleteFromFavorites(id: string) {
    this.localstorageService.removeLocalStorage(id);
  }

  isFavorite(): string {
    if (this.clickFavoriteStar) {
      return 'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z'
    } else {
      return 'M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.565.565 0 0 0-.163-.505L1.71 6.745l4.052-.576a.525.525 0 0 0 .393-.288L8 2.223l1.847 3.658a.525.525 0 0 0 .393.288l4.052.575-2.906 2.77a.565.565 0 0 0-.163.506l.694 3.957-3.686-1.894a.503.503 0 0 0-.461 0z'
    }
  }
}
