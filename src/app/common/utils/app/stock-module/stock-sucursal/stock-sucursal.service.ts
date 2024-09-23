import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBaseApi, versionApi } from '../../../local/server.local';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';

@Injectable({
  providedIn: 'root'
})
export class StockSucursalService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/stock-sucursal';

  public stockSucursalAgregar(data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }

  public stockSucursalAgregarMultiple(id_sucursal: number, id_almacen: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal + '/' + id_almacen;
    return this.http.post<ApiResult>(url, null);
  }

  public stockSucursalAlmacenGetList(id_sucursal: number, id_almacen: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal + '/' + id_almacen;
    return this.http.get<ApiResult>(url);
  }

  public stockSucursalAlmacenGetOne(id_sucursal: number, id_almacen: number, cod_producto: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal + '/' + id_almacen + '/' + cod_producto;
    return this.http.get<ApiResult>(url);
  }

  public stockSucursalBusqueda(id_sucursal: number, id_almacen: number, attribute: string, value: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal + '/' + id_almacen + '/' + attribute + '/' + value;
    return this.http.get<ApiResult>(url);
  }

  public stockSucursalGetOneCantidad(cod_producto: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + cod_producto;
    return this.http.get<ApiResult>(url);
  }

  public stockSucursalUpdate(id_sucursal: number, id_almacen: number, cod_producto: string, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal + '/' + id_almacen + '/' + cod_producto;
    return this.http.patch<ApiResult>(url, data);
  }

  public stockSucursalDelete(id_sucursal: number, id_almacen: number, cod_producto: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_sucursal + '/' + id_almacen + '/' + cod_producto;
    return this.http.delete<ApiResult>(url);
  }
}
