import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { MatMenuTrigger } from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import { AuthService } from "../auth/auth.service";

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})

export class HeaderComponent {
	userIsAuthenticated = false;
	username: string = '';
	userStatus: string | null = '';
	private userAuthSub: Subscription = new Subscription();

	constructor( 
		private authService: AuthService
	) {};

	@ViewChild('surveyMenuTrigger') surveyMenuTrigger!: MatMenuTrigger;
	@ViewChild('volunteerMenuTrigger') volunteerMenuTrigger!: MatMenuTrigger;

	ngOnInit() {
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.userStatus = this.authService.getUserStatus();
		this.userAuthSub = this.authService.getUserAuthListener().subscribe( userAuthData => {
			this.userIsAuthenticated = userAuthData.authStatus;
			this.userStatus = userAuthData.userStatus;
		})


		this.userIsAuthenticated = true;
		this.userStatus = 'admin';

	}

	ngOnDestroy() {
		this.userAuthSub.unsubscribe();
	}

	onLogout() {
		this.authService.logout();
	}

	openSurveyMenu() {
		this.surveyMenuTrigger.openMenu();
	}

	closeSurveyMenu() {
		this.surveyMenuTrigger.closeMenu();
	}

	openVolunteerMenu() {
		this.volunteerMenuTrigger.openMenu();
	}

	closeVolunteerMenu() {
		this.volunteerMenuTrigger.closeMenu();
	}
}