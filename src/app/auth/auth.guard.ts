/* Guard is a class
	- used for protecting routes
	- for example, /create can be typed into the browser and have access to that page when nobody is logged in
	- only logged in users can create page, so we use guards
	- remember to add this to app-router module
	- guards are entirely a front-end UX thing. in this app, we are already protecting back-end, but also preventing user from doing
	  someting that is doomed to fail

	CanActivate
	- return true, then we know that the route we are protecting is accessible
	- if false, router will deny access. when returning false, also navigate away from page. otherwise, will block loading of page

*/

import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from "./auth.service";

@Injectable()

export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService, private router: Router, private _snackBar: MatSnackBar) {}

	canActivate(
		route: ActivatedRouteSnapshot, 
		state: RouterStateSnapshot
	): boolean | Observable<boolean> | Promise<boolean> {
		const isAuth = this.authService.getIsAuth();
		const status = this.authService.getUserStatus();
		var path = route.routeConfig!.path;
		if (!isAuth) {
			this.router.navigate(['/auth/login']);
		} else {
			var pathSplit = path!.split('/');
			path = pathSplit[0];
			switch (status) {
				case 'admin':
					// admin has access to everything
					break;
				case 'staff':
					// staff will have access to everything except 'users' page
					if ( path === 'users') {
						this.router.navigate(['/homepage']);
						this._snackBar.open("You are unauthorized to view this page. Please see an admin to resolve this issue.", "Okay");
					}
					break;
				case 'caller':
					// caller cannot access survey
					if (
						path === 'survey' || 
						path === 'surveyanswer' || 
						pathSplit[1] === 'email' || 
						path === 'users' || 
						path === 'polls' ||
						path === 'voters' 
						) {
						this.router.navigate(['/volunteers/view']);
						this._snackBar.open("You are unauthorized to view this page. Please see an admin to resolve this issue.", "Okay");
					}
					break;
				case 'canvasser':
					// canvassers cannot access the volunteer database
					if (path === 'volunteers' || path === 'users' || path === 'polls') {
						this.router.navigate(['/survey/view']);
						this._snackBar.open("You are unauthorized to view this page. Please see an admin to resolve this issue.", "Okay");
					}
					break;
				case 'caller and canvasser':
					// if both caller and canvasser, they can't email or access 'users'
					if (pathSplit[1] === 'email' || path === 'users' || path === 'polls') {
						this.router.navigate(['/survey/view']);
						this._snackBar.open("You are unauthorized to view this page. Please see an admin to resolve this issue.", "Okay");
					}
					break;
				default:
					// unverified users come here. they cannot access anything.
					this.router.navigate(['/homepage']);
					this._snackBar.open("You are unauthorized to view this page. Please see an admin to resolve this issue.", "Okay");
					break;

			}

		}
		return isAuth;		
	}

}