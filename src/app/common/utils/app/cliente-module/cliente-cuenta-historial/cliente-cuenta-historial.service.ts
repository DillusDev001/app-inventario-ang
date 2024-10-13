import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { urlBaseApi, versionApi } from '../../../local/server.local';

@Injectable({
  providedIn: 'root'
})
export class ClienteCuentaHistorialService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/cliente-cuenta-historial';

  // Post Cliente
  public clienteCuentaHistorialAgregar(data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }

  // Get Cliente
  public clienteCuentaHistorialGetById(id_cliente: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.get<ApiResult>(url);
  }

  // Patch Cliente
  public clienteCuentaHistorialActualizar(id_historial: number, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_historial;
    return this.http.patch<ApiResult>(url, data);
  }
  // Delete Cliente
  public clienteCuentaHistorialEliminar(id_historial: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_historial;
    return this.http.delete<ApiResult>(url);
  }

}
