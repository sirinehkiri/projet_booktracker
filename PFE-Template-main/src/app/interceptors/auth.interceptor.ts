import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Injectable } from '@angular/core';

import { Router } from '@angular/router';

import {
  Observable,
  throwError
} from 'rxjs';

import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor
implements HttpInterceptor {

  constructor(
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    const token =
      localStorage.getItem('token');

    let authReq = req;

    // ADD TOKEN
    if (token) {

      authReq = req.clone({

        setHeaders: {
          Authorization: `Bearer ${token}`
        }

      });
    }

    return next.handle(authReq).pipe(

      catchError((error: HttpErrorResponse) => {

        // TOKEN EXPIRED / INVALID
        if (error.status === 401) {

          // CLEAR STORAGE
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          // REDIRECT LOGIN
          this.router.navigate([
            '/authentication/side-login'
          ]);
        }

        return throwError(() => error);
      })

    );
  }
}