import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlBaseApi, versionApi } from '../../local/server.local';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  urlBase: string = urlBaseApi;
  urlVersion: string = versionApi;
  urlModule: string = '/usuario';

  // Post Usuario
  public usuarioAgregar(data:any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.post<ApiResult>(url, data);
  }
  // Get Lista Usuario
  public usuarioLista(): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule;
    return this.http.get<ApiResult>(url);
  }

  // Get Usuario
  public usuarioGet(usuario: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + usuario;
    return this.http.get<ApiResult>(url);
  }

  // Patch Usuario
  public usuarioActualizar(usuario: string, data:any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + usuario;
    return this.http.patch<ApiResult>(url, data);
  }
  // Delete Usuario

  // Get busqueda
  public usuarioBusqueda(attribute: string, value: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/busqueda/' + attribute + '/' + value;
    return this.http.get<ApiResult>(url);
  }

  


  // busqueda/:attribute/:value


  public usuarioAuth(usuario: string, password: string): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/' + usuario + '/' + password;
    return this.http.get<ApiResult>(url);
  }

  public usuarioForgot(usuario: string, data: any): Observable<ApiResult> {
    const url = this.urlBase + this.urlVersion + this.urlModule + '/forgot/' + usuario;
    return this.http.patch<ApiResult>(url,data);
  }
}
