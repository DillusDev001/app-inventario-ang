import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { urlBaseApi, versionApi } from '../../../local/server.local';

@Injectable({
  providedIn: 'root'
})
export class ClienteCuentaService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/cliente-cuenta';

  // Post Cliente
  public clienteCuentaAgregar(data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }

  // Get Cliente
  public clienteCuentaGetById(id_cliente: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.get<ApiResult>(url);
  }

  // Patch Cliente
  public clienteCuentaActualizar(id_cliente: number, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.patch<ApiResult>(url, data);
  }
  // Delete Cliente
  public clienteCuentaEliminar(id_cliente: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.delete<ApiResult>(url);
  }

}
