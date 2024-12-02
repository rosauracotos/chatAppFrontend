import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApiBackendService {

  constructor(private http: HttpClient) { }

  validarCelular(celular: string):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`chatappbackend-production-52f3.up.railway.app/api/persona/validarcel/`+ celular, { headers: headers });
  }

  obtenerContactos(idpersona: string | number):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`chatappbackend-production-52f3.up.railway.app/api/persona/listarContactos/`+ idpersona, { headers: headers });
  }

  obtenerSala(celular1: string, celular2: string):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      celular1: celular1,
      celular2: celular2
    };
    return this.http.post<any>(`chatappbackend-production-52f3.up.railway.app/api/sala/obtenerSala`,body, { headers: headers });
  }

  obtenerChat(salaId: string, celular: string):Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const body = {
      salaId: salaId,
      celular: celular
    };
    return this.http.post<any>(`chatappbackend-production-52f3.up.railway.app/api/mensaje/obtenerChat`,body, { headers: headers });
  }

}
