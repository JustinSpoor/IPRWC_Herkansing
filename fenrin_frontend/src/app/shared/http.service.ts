import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {catchError, Observable, throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  API_PATH: string = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {
  }

  private handleError(error: HttpErrorResponse) {
    return throwError(() => new Error(error.message));
  }

  httpGet(route: string): Observable<any> {
    return this.http.get<any>(`${this.API_PATH}/${route}`).pipe(
      catchError(this.handleError)
    );
  }

  httpPatch(route: string, body: any): Observable<any> {
    return this.http.patch(`${this.API_PATH}/${route}`, body).pipe(
      catchError(this.handleError)
    );
  }

  httpDelete(route: string, id: any): Observable<any> {
    return this.http.delete(`${this.API_PATH}/${route}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  httpPost(route: string, body: any): Observable<any> {
    return this.http.post(`${this.API_PATH}/${route}`, body).pipe(
      catchError(this.handleError)
    );
  }
}
