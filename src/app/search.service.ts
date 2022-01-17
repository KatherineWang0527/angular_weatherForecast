import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

import {of} from "rxjs";
import {map} from "rxjs/operators";
interface myData {
  obj: Array<Object>
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  constructor(private httpClient: HttpClient) {
  }

//build a list of pair of city, state
  cityState?: [string, string];
  jsons?: any;

//auto complete
  public getCityData(location: string): Observable<any> {
    let url = "https://csci571yuanbackend.wl.r.appspot.com/auto?id=" + location
    return this.httpClient.get<myData>(url);
  }

  public callChart(location: string): Observable<any>{
    return this.httpClient.get('https://csci571yuanbackend.wl.r.appspot.com/chart?id='+location);
  }

}
