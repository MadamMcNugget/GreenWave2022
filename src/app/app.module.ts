import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularMaterialModule } from './angular-material.module';

import { VolunteersModule } from './volunteers/volunteers.module';
import { SurveyModule } from './survey/survey.module';

import { HeaderComponent } from './header/header.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UsersViewComponent, UserEditDialog } from './auth/users-view/users-view.component';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error-interceptor';

@NgModule( {
	declarations: [
		AppComponent,
		HeaderComponent,
		HomepageComponent,
		UsersViewComponent, 
		UserEditDialog, ErrorComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		AppRoutingModule,
		AngularMaterialModule,
		BrowserAnimationsModule,
		FormsModule,
		ReactiveFormsModule,
		VolunteersModule,
		SurveyModule
	],
	providers: [
		{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
		{provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
	],
	bootstrap: [ AppComponent ],
	entryComponents: [ UserEditDialog, ErrorComponent ]
} )
export class AppModule { }
