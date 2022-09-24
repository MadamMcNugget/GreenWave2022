import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subject, Subscription, takeUntil } from "rxjs";
import { MatMenuTrigger } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from "../auth/auth.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";

@Component( {
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: [ './header.component.css' ]
} )

export class HeaderComponent {

	userIsAuthenticated = false;
	username: string = '';
	userStatus: string | null = '';
	currentScreenSize: string = 'Medium';
	destroyed = new Subject<void>();
	private userAuthSub: Subscription = new Subscription();

	displayNameMap = new Map( [
		[ Breakpoints.XSmall, 'XSmall' ],
		[ Breakpoints.Small, 'Small' ],
		[ Breakpoints.Medium, 'Medium' ],
		[ Breakpoints.Large, 'Large' ],
		[ Breakpoints.XLarge, 'XLarge' ],
	] );

	constructor (
		private authService: AuthService,
		private breakpointObserver: BreakpointObserver
	) {
		breakpointObserver.observe( [
			Breakpoints.XSmall,
			Breakpoints.Small,
			Breakpoints.Medium,
			Breakpoints.Large,
			Breakpoints.XLarge
		] ).pipe( takeUntil( this.destroyed ) )
			.subscribe( result => {
				for ( const query of Object.keys( result.breakpoints ) ) {
					if ( result.breakpoints[ query ] ) {
						this.currentScreenSize = this.displayNameMap.get( query ) ?? 'Unknown';
					}
				}
			} );
	};

	@ViewChild( 'surveyMenuTrigger' ) surveyMenuTrigger!: MatMenuTrigger;
	@ViewChild( 'volunteerMenuTrigger' ) volunteerMenuTrigger!: MatMenuTrigger;
	@ViewChild( 'voterMenuTrigger' ) voterMenuTrigger!: MatMenuTrigger;

	ngOnInit() {
		this.userIsAuthenticated = this.authService.getIsAuth();
		this.userStatus = this.authService.getUserStatus();
		this.userAuthSub = this.authService.getUserAuthListener().subscribe( userAuthData => {
			this.userIsAuthenticated = userAuthData.authStatus;
			this.userStatus = userAuthData.userStatus;
		} )
	}

	ngOnDestroy() {
		this.userAuthSub.unsubscribe();
		this.destroyed.next();
		this.destroyed.complete();
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

	openVoterMenu() {
		this.voterMenuTrigger.openMenu();
	}

	closeVoterMenu() {
		this.voterMenuTrigger.closeMenu();
	}
}