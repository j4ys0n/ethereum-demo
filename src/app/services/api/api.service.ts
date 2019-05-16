import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Response } from '@angular/http';

import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

type Methods = {
  readonly post: boolean;
  readonly put: boolean;
}

const METHODS: Methods = {
  post: true,
  put: true
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  baseUrl = '';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json'
    })
  };

  constructor(
    private http: HttpClient
  ) {
    if (!environment.production) {
      // this.baseUrl = 'http://localhost:3000';
    }
  }

  getData(endpoint: string = ''): Observable<any> {
    return this.http.get<any>(endpoint)
      .pipe(
        catchError((err) => {
          return this.handleError(err, endpoint)
        })
      );
  }

  sendData(endpoint: string = '', payload: any, method: string = 'post'): Observable<any> {
    if (METHODS[method]) {
      let req: any;
      switch (method) {
        case 'post':
          req = this.http.post<any>(this.baseUrl + endpoint, payload, this.httpOptions)
          break;
        case 'put':
          req = this.http.put<any>(this.baseUrl + endpoint, payload, this.httpOptions)
          break;
      }
      return req.pipe( catchError((err) => {
        return this.handleError(err, endpoint)
      }));
    } else {
      return new Observable(observer => {
        observer.next({status: 500, message: 'error', error: 'bad method'})
        observer.complete();
      })
    }

  }

  private extractData(res: Response) {
    return res || [];
  }

  private handleError(err: any, endpoint: string): Observable<any> {
    let response;
    if (endpoint.indexOf('/state') > -1) {
      response = {
        error: {status: err.status, message: 'api error', error: err},
        history:[],
        live: [],
        map: [],
        read: [],
        log: []
      };
    } else {
      response = {status: err.status, message: 'error', error: err}
    }

    if (err.status >= 400 && err.status < 500) {
      if (err.error) {
        console.log(err.error);
      } else {
        console.error(err);
      }
    } else if (err.status === 0) {
      console.log(err.message);
    } else {
      console.error(err);
    }
    return new Observable(observer => {
      observer.next(response);
      observer.complete();
    });
  }
}
