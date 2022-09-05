import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService } from "../auth.service";

@Component( {
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: [ './login.component.css' ]
} )
export class LoginComponent implements OnInit, OnDestroy {

	isLoading = false;
	private authStatusSub: Subscription = new Subscription;

	constructor ( 
		public authService: AuthService 
		) { }

	ngOnInit() {
		this.authStatusSub = this.authService.getUserAuthListener().subscribe( ( authStatus ) => {
			this.isLoading = false;
		} );
	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe();
	}

	onLogin( form: NgForm ) {
		if ( form.invalid ) {
			console.log( "form is invalid" );
			return;
		}
		this.isLoading = true;
		this.authService.login( form.value.email, form.value.password );
	}

}
