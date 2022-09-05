import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularMaterialModule } from './angular-material.module';

import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UsersViewComponent, UserEditDialog } from './auth/users-view/users-view.component';

import { AuthInterceptor } from './auth/auth-interceptor';

@NgModule( {
	declarations: [
		AppComponent,
		HeaderComponent,
		HomepageComponent,
		UsersViewComponent, 
		UserEditDialog
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		AngularMaterialModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule 
	],
	providers: [
		{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
	],
	bootstrap: [ AppComponent ],
	entryComponents: [ UserEditDialog ]
} )
export class AppModule { }
