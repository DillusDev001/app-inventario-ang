import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBaseApi, versionApi } from '../../local/server.local';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';

@Injectable({
  providedIn: 'root'
})
export class AlmacenService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/almacen';

  public almacenAgregar(data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }

  public almacenGetList(id_sucursal: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal;
    return this.http.get<ApiResult>(url);
  }

  public almacenGetOne(id_almacen: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/id_almacen/' + id_almacen;
    return this.http.get<ApiResult>(url);
  }

  public almacenUpdate(id_almacen: number, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_almacen;
    return this.http.patch<ApiResult>(url, data);
  }

  public almacenDelete(id_almacen: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_almacen;
    return this.http.delete<ApiResult>(url);
  }

}
