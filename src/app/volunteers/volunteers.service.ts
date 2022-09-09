import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';  // is like eventemitter, but much broader than angular's eventemitter
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Volunteer } from './volunteer.model';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

/*  Environment Variables
	- same as global variables
	- can only be used in angular project, not for backend, only frontend
	- backend uses NODE environment variables instead -> created nodemon.js in /begin
	- found in src/environments/environment.ts
	- BACKEND_URL to be saved as env. variable
*/
const BACKEND_URL = environment.apiUrl + '/volunteers/';

@Injectable	({providedIn: 'root'})  // may pass javascript object as parameter to configure
									// providedIn: 'root' - provides this services from the root level, and creates only 1 instance of this service to the entire app
 									// need for this post app as we only want 1 instance of posts rather than multiple copies with different arrays.
export class VolunteersService {

	roles = [
		{ role: "Foot Canvass", controlName: "footCanvass", description: "Help canvasss by foot"},
		{ role: "Phone Canvass", controlName: "phoneCanvass", description: "Help canvasss by phone"},
		{ role: "Office", controlName: "office", description: "office duties including crafting, etc"},
		{ role: "Hosting", controlName: "hosting", description: "Host their own home for meetings/events"},
		{ role: "Events", controlName: "events", description: "Man tables at events"},
		{ role: "Social Media Contributor", controlName: "smc", description: "Help us contribute to social media by tagging us"},
		{ role: "Sign and Poster", controlName: "signposter", description: "Put up signs and posters"},
		{ role: "Photographer", controlName: "photographer", description: "Help with photography and videography"},
		{ role: "Core Team", controlName: "core", description: "Does big things! "}
  	]

	private	volunteers: Volunteer[] = [];  // to store a list of posts
	private userId: string = '';
	private volunteersUpdated = new Subject<{volunteers: Volunteer[]}>();
	private isLoading = false;

	constructor(
		private http: HttpClient, 
		private router: Router, 
		private authService: AuthService,
		private _snackBar: MatSnackBar
	) {} // eyy other services can be injected into other services too

	saveNewVolunteer(form: any) {
		this.http.post<{message: string, survey: any }>(BACKEND_URL, form)
		.subscribe( (responseData) => {
			this.router.navigate(["/volunteers/view"]);
		});
	}

	getAllVolunteers(){
		this.http.get<{message: string, volunteers: any}> (
				BACKEND_URL
			)    // dont need to unsubscribe because for observables connected to features built into angular, unsubscription will be handled by angular.
			.pipe( map( ( volunteerData) => {	//map here is from rxjs. transforms every elemnt of an array into a new element and store them all back into a new array
				return {
					volunteers: volunteerData.volunteers.map( ( volunteer:any ) => {  //we want to replace every post with a new javascript object
						return {
							id: volunteer._id,
							firstName: volunteer.firstName,
							lastName: volunteer.lastName,
							email: volunteer.email,
							phoneNumber: volunteer.phoneNumber,
							address: volunteer.address,
							intake: volunteer.intake,
							footCanvass: volunteer.roles.footCanvass,
							phoneCanvass: volunteer.roles.phoneCanvass,
							hosting: volunteer.roles.hosting,
							office: volunteer.roles.office,
							events: volunteer.roles.events,
							smc: volunteer.roles.smc,
							signposter: volunteer.roles.signposter,
							photographer: volunteer.roles.photographer,
							core: volunteer.roles.core,
							notes: volunteer.notes
						};	// so now every element in the array will be converted to an object which will be put back into a new array which is returned here. is then wrapped by observable
					})
				}; //map here is javascript. 
			}))
			.subscribe( (transformedVolunteerData) => {	// transformedPosts is result of map operations.
				this.volunteers = transformedVolunteerData.volunteers;
				this.volunteersUpdated.next({ volunteers: [...this.volunteers] });	// inform other parts of app that we added a post
			});   
	}

	getOneVolunteer(volID: string) {
		return this.http.get<{
			_id: string, 
			firstName: string, 
			lastName: string, 
			email: string, 
			phoneNumber: string,
			address: string,
			intake: boolean,
			roles:{
				footCanvass: boolean,
				phoneCanvass: boolean,
				office: boolean,
				hosting: boolean,
				events: boolean,
				smc: boolean,
				signposter: boolean,
				photographer: boolean,
				core: boolean
			}
			notes: string
		}>( BACKEND_URL + volID);
	}

	updateVolunteer(id: string, form:any) {
		this.http.put(BACKEND_URL + id, form)
			.subscribe(response => {
				this.router.navigate(["/volunteers/view"]);
			});
	}

	getVolunteersUpdatedListener() {
		return this.volunteersUpdated;
	}

	deleteVolunteer( volID: string ) {
		return this.http.delete(BACKEND_URL + volID);
	}

	sendEmail(email:any) {

		this.isLoading = true;
		
		this.http.post(BACKEND_URL + "sendmail", email).subscribe( response => {
			console.log(response);
			this._snackBar.open("Message sent!", "close", {
				duration: 10000,
			});
			this.router.navigate(["/volunteers/view"]);
			this.isLoading = false;
		})
	}

	getRoles() {
		return this.roles;
	}
}