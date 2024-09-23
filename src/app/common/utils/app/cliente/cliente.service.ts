import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBaseApi, versionApi } from '../../local/server.local';
import { Observable } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/cliente';

  // Post Cliente
  public clienteAgregar(data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }

  // Get Lista Cliente
  public clienteLista(): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.get<ApiResult>(url);
  }

  // Get Cliente
  public clienteGetById(id_cliente: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.get<ApiResult>(url);
  }

  // Get busqueda
  public clienteBusqueda(attribute: string, value: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/busqueda/' + attribute + '/' + value;
    return this.http.get<ApiResult>(url);
  }

  // Patch Cliente
  public clienteActualizar(id_cliente: number, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.patch<ApiResult>(url, data);
  }
  // Delete Cliente
  public clienteEliminar(id_cliente: number): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + id_cliente;
    return this.http.delete<ApiResult>(url);
  }

}
