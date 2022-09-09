/*  Interceptors
   	- is a function that runs on any outgoing http request
   	- in our case, we want to add the json token to each header
	- provided by Angular http

	- because we are setting an 'Authorization' header, will need to allow this in backend app.js
*/

import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";

import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ErrorComponent } from './error/error.component';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

	constructor(private dialogue: MatDialog) {}

	intercept(req: HttpRequest<any>, next: HttpHandler) {		// <any> since we want to include all outgoing requests, not a specific kind.

		return next.handle(req).pipe(
			catchError( (error: HttpErrorResponse) => {
				let errorMessage = "An unknown error occured!";
				if (error.error.message){
					errorMessage = error.error.message;
				}
				this.dialogue.open(ErrorComponent, {data: {message: errorMessage} });
				return throwError(error);
			})
		);

	}

}