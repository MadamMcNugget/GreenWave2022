import { HttpInterceptor, HttpRequest, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { AuthService } from './auth.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService){}

	intercept(req: HttpRequest<any>, next: HttpHandler) {		// <any> since we want to include all outgoing requests, not a specific kind.

		const authToken = this.authService.getToken();

		const authRequest = req.clone({		// since we don't want to manipulate the request directly, we clone it.. these clones can be editted like so
			headers: req.headers.set('Authorization', "Bearer " + authToken)
						// 'set' doesnt override entire header, just certain header if is doesn't already exist. otherwise, add that header
						// same 'authorization' as in check-auth.js ..req.headers.authorization.split(" ")...  is not cap sensicate
						// reminder that 'Bearer' is just convention we often see. can be omitted.
		});	

		return next.handle(authRequest);

	}

}