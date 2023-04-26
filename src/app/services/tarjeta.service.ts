import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TarjetaService {
  myURL = 'https://localhost:7209';
  myApiURL = '/api/Tarjeta/';

  constructor(private _http: HttpClient) {
    console.warn('estamos conectados');
  }

  getTarjetas(): Observable<any> {
    return this._http.get(this.myURL + this.myApiURL);
  }

  deleteTarjeta(id: number): Observable<any> {
    return this._http.delete(this.myURL + this.myApiURL + id);
  }

  saveTarjeta(tarjeta: any): Observable<any> {
    return this._http.post(this.myURL + this.myApiURL, tarjeta);
  }

  updateTarjeta(id: number, tarjeta: any): Observable<any> {
    return this._http.put(this.myURL + this.myApiURL + id, tarjeta);
  }
}
