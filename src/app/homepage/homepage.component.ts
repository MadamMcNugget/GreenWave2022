import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component( {
	selector: 'app-homepage',
	templateUrl: './homepage.component.html',
	styleUrls: [ './homepage.component.css' ]
} )
export class HomepageComponent implements OnInit {

	userIsAuthenticated = false;
	userStatus: string | null = 'unverified';

	constructor (
		private authService: AuthService
	) { }

	ngOnInit(): void {
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.userStatus = this.authService.getUserStatus();
		this.authService.getUserAuthListener().subscribe( userAuthData => {
			this.userIsAuthenticated = userAuthData.authStatus;
			this.userStatus = userAuthData.userStatus;
		})
	}

}
