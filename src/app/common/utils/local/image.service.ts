import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as JsBarcode from 'jsbarcode';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http: HttpClient) { }

  getImageBase64(imageUrl: string): Observable<string> {
    return new Observable(observer => {
      this.http.get(imageUrl, { responseType: 'blob' }).subscribe(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          observer.next(reader.result as string);
          observer.complete();
        };
        reader.readAsDataURL(blob);
      }, err => {
        observer.error(err);
      });
    });
  }

  generateBarcode(value: string): string {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, value, {
      format: 'CODE128', // Tipo de código de barras (puedes elegir otros formatos)
      width: 2,
      height: 100,
      displayValue: false,
    });
    return canvas.toDataURL('image/png'); // Devuelve el código de barras como base64
  }
}
