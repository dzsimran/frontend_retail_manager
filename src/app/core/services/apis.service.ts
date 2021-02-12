import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Constants} from '../constant-values';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApisService {

  constructor(private httpClient: HttpClient) {
  }

  createStoreDetail(dataPayload): Observable<any> {
    return this.httpClient.post(Constants.createNewstore, dataPayload);
  }

  getstoreDetails(dataPayload, pageNumber, pageSize): Observable<any> {
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    return this.httpClient.post(Constants.storestoresDetail , dataPayload, {headers: {'Access-Control-Allow-Origin': '*'}, params: params});
  }

  getGeoLocationData(addressInput): Observable<any>{
    let params = new HttpParams();
    params = params.append('address', addressInput);
    params = params.append('key', environment.geoAPIKey);
    return this.httpClient.get(environment.geoAPI, {params});
  }
}
