import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBaseApi, versionApi } from '../../../local/server.local';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';

@Injectable({
  providedIn: 'root'
})
export class StockGeneralService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/stock-general';

  public stockGeneralAgregar(data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }

  public stockGeneralGetList(): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.get<ApiResult>(url);
  }

  public stockGeneralAgregarMultiple(): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/multiple';
    return this.http.post<ApiResult>(url, null);
  }

  public stockGeneralGetOne(cod_producto: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + cod_producto;
    return this.http.get<ApiResult>(url);
  }

  public stockGeneralUpdate(cod_producto: string, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + cod_producto;
    return this.http.patch<ApiResult>(url, data);
  }

  public stockGeneralDelete(cod_producto: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + cod_producto;
    return this.http.delete<ApiResult>(url);
  }

}
