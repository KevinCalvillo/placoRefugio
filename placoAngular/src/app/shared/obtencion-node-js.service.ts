import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObtencionNodeJSService {
  private bd = 'http://167.71.175.189:3000/api/bd';

  constructor(private http: HttpClient) { }

  getData():Observable<any> {
    return this.http.get<any>(this.bd);
  }

  
}
