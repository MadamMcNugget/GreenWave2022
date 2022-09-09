import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string = '';
	private userauthListener = new Subject<{authStatus: boolean, userStatus: string | null}>();
	private isAuthenticated = false;
	private tokenTimer: any;
	private userId: string = '';
	private userEmail: string = '';
	private userStatus: string = '';
	private authStatusListener = new Subject<boolean>();
	users = [];
	private usersUpdated = new Subject<{ users: AuthData[] }>();
	

	constructor( 
		private http: HttpClient, 
		private router: Router, 
		private dia: MatDialog
	) {}

	getAuthStatusListener() {
		return this.authStatusListener.asObservable();
	}

	getToken() {
		return this.token;
	}

	getIsAuth() {
		return this.isAuthenticated;
	}

	getUserAuthListener() {
		return this.userauthListener.asObservable();
	}

	getUserId() {
		return this.userId;
	}

	getUserStatus() {
		return this.userStatus;
	}

	getUserEmail(){
		return this.userEmail;
	}

	createCustomer ( email: string, password: string) {
		const authData: AuthData = {email: email, password: password, status: 'unverified'};
		return this.http.post(BACKEND_URL + "signup", authData).subscribe(() => {
			this.router.navigate(['/']);
		}, error => {
			this.userauthListener.next({ authStatus: false, userStatus: null });
		});
	}

	createStaff ( email: string, password: string) {
		const authData: AuthData = {email: email, password: password, status: 'staff'};
		return this.http.post(BACKEND_URL + "signup", authData).subscribe(() => {
			this.router.navigate(['/']);
		}, error => {
			this.userauthListener.next({ authStatus: false, userStatus: null });
		});
	}

	login(email: string, password: string) {
		const authData = {email: email, password: password};
		this.http.post<{token: string, expiresIn: number, userId: string, status: string}>(BACKEND_URL + "login", authData).subscribe({
			next: response => {
				const token = response.token;
				this.token = token;
				if (token) {
					this.userEmail = email
					this.userId = response.userId;
					this.userStatus = response.status;
					this.isAuthenticated = true;
					this.userauthListener.next({authStatus: true, userStatus: this.userStatus});
					//const expiresInDuration = response.expiresIn;
					//this.setAuthTimer(expiresInDuration);
					//const now = new Date();
					//const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
					this.saveAuthData(token, /*expirationDate, */ null, this.userId, this.userEmail, this.userStatus);
					this.router.navigate(['/']);
				}
			}, 
			error: error => {
				this.userauthListener.next({ authStatus: false, userStatus: null });
			},
			complete: () => {
				console.log( 'login complete' );
			}
		});
	}

	logout() {
		this.token = '';
		this.userId = '';
		this.isAuthenticated = false;
		this.userStatus = '';
		this.userauthListener.next({authStatus: false, userStatus: null});
		this.router.navigate(['/']);
		//clearTimeout(this.tokenTimer);
		this.clearAuthData();
	}

	private setAuthTimer(duration: number) {
		this.tokenTimer = setTimeout( () => {
			this.logout();
		}, duration * 1000 ); 	// setTimeout() is in milliseconds, so *1000. also wanna reset timer if logged out manually
	}

	/*  Token storage 
	- on page reload, login status doesn't stay. so put token in memory
	- token can be stored in browser
	- angular takes care of X-site scripting, so we don't have to worry about that
	- can see browser storage in chrome -> dev tools -> application -> local storage
	- can insert these methods in app.component.ts since we want this to run when application starts
	*/
	private saveAuthData(token: string, expirationDate: Date | null, userId: string, userEmail: string, userStatus: string) {
		localStorage.setItem('token', token);
		//localStorage.setItem('expiration', expirationDate.toISOString() );	// ISOString is standard style version of date, can extract data from it
		localStorage.setItem('userId', userId);
		localStorage.setItem('userEmail', userEmail);
		localStorage.setItem('userStatus', userStatus);
	}

	private clearAuthData() {
		localStorage.removeItem('token');
		//localStorage.removeItem('expiration');
		localStorage.removeItem('userId');
		localStorage.removeItem('userEmail');
		localStorage.removeItem('userStatus')
	}

	// automatically authenticates user if we have the information for it in browser local storage
	// can only validate token in server, but will at least check if expiration date is in future.
	autoAuthUser() {	
		const authInfo = this.getAuthData();
		const now = new Date();
		if (!authInfo) {
			return;
		}
		//const expiresIn = authInfo.expirationDate.getTime() - now.getTime();	//getTime is in millisecs
		//if (expiresIn > 0) {
			this.token = authInfo.token;
			this.isAuthenticated = true;
			this.userId = this.nullToString( authInfo.userId );
			this.userEmail = this.nullToString( authInfo.userEmail );
			this.userStatus = this.nullToString( authInfo.userStatus );
			//this.setAuthTimer(expiresIn / 1000);
			this.userauthListener.next({ authStatus: true, userStatus: authInfo.userStatus });
		//}
	}

	private getAuthData() {
		const token = localStorage.getItem('token');
		//const exDate = localStorage.getItem('expiration');
		const userId = localStorage.getItem('userId');
		const userEmail = localStorage.getItem('userEmail');
		const userStatus = localStorage.getItem('userStatus');
		if (!token /*|| !exDate*/) {
			return;
		}
		return {
			token: token,
			//expirationDate: new Date(exDate),
			userId: userId,
			userEmail: userEmail,
			userStatus: userStatus
		}
	}

	getAllUsers() {
		this.http.get<{message: string, users: any}> (
				BACKEND_URL + 'view'
			)    // dont need to unsubscribe because for observables connected to features built into angular, unsubscription will be handled by angular.
			.pipe( map( ( usersData:{ message: string, users: any } ) => {	//map here is from rxjs. transforms every elemnt of an array into a new element and store them all back into a new array
				return {
					users: usersData.users.map( ( volunteer: any ) => {  //we want to replace every post with a new javascript object
						return {
							id: volunteer._id,
							email: volunteer.email,
							status: volunteer.status,
						};	// so now every element in the array will be converted to an object which will be put back into a new array which is returned here. is then wrapped by observable
					})
				}; //map here is javascript. 
			}))
			.subscribe( (transformedUserData) => {	// transformedPosts is result of map operations.
				this.users = transformedUserData.users;
				this.usersUpdated.next({ users: [...this.users] });	// inform other parts of app that we added a post
			});   
	}

	getUsersUpdatedListener() {
		return this.usersUpdated.asObservable();
	}

	editUser(userID:string, userEmail:string, userStatus:string) {
		var user = {
			id: userID,
			email: userEmail,
			status: userStatus
		}
		this.http.put(BACKEND_URL + userID, user)
			.subscribe( response => {
				this.dia.closeAll();
				
			});

	}

	nullToString( value: string | null ): string {
		return value == null ? '' : value;
	}

}
