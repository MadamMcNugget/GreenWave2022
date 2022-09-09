// in typescript, we can create a new component by creating a new class
// class allows us to create a blueprint for an object, who we will not create that object on our own, its done by angular. we just define what it will look like

//include decorator with '@' to turn class into code that angular understands. needs to be imported

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
//import { mimeType } from './mime-type.validator'
import { Subscription } from 'rxjs';
//import { AuthService } from '../../auth/auth.service';

import { Volunteer } from '../volunteer.model';
import { VolunteersService } from '../volunteers.service';

@Component({    // Component object takes soem configurationg which comes in the form of a javascript object which we pass to it.
	selector: 'app-volunteers-create',     // selector allows us to use this component
	templateUrl: './volunteers-create.component.html',     // can pass plain html ( such as '<h1> A header </h1>' ), but not ideal for bigger files.
	styleUrls: ['./volunteers-create.component.css']
})

export class VolunteersCreateComponent implements OnInit, OnDestroy {    // PostCreateComponent is name, convention to use filename + component with caps of 1st letter of each word
	// dont have to add anything here

	volunteer!: Volunteer;
	isLoading = false;
	volunteerFormGroup!: FormGroup;
	
	mode = 'Create';
	private volunteerId: string = '';
	private authStatusSub!: Subscription;

	// roles: { role: string, controlName: string, description: string }[] = [];

	//@Output() postCreated = new EventEmitter<Post>();   // @Output turns postCreated to something that can be listened from outside.  EventEmitter is generic type, add <Post> to set as post

	constructor(
		//public postsService: PostsService, 
		public route: ActivatedRoute,
		public volunteersService: VolunteersService 
		//private authService: AuthService
	) {}  //want to reach postsService not onInit, but whenever new post is created. with this, we dont need eventemitter and output anymore

	ngOnInit() {	// extract whether we are create new post or editting old. if have postID, then edit, otherwise is create

		/*this.authStatusSub = this.authService.getUserAuthListener().subscribe( authStatus => {
			this.isLoading = false;
		});*/
		this.isLoading = true;

		// this.roles = this.volunteersService.getRoles();

		this.volunteerFormGroup = new FormGroup({
			'firstName': new FormControl(null),
			'lastName': new FormControl(),
			'email': new FormControl(null, {
				validators: [Validators.required]
			}),
			'phoneNumber': new FormControl(null),
			'address': new FormControl(null),
			// 'intake': new FormControl(false),
			// 'roles': new FormGroup({
			// }),
			'notes': new FormControl(null)
		});

		// for ( var i = 0 ; i < this.roles.length ; i++ ){
		// 	(<FormGroup>this.volunteerFormGroup.get('roles')).addControl(this.roles[i].controlName, new FormControl(false));
		// }

		// for editting post/order
		
		this.route.paramMap.subscribe( (paramMap: ParamMap ) => {
			if (paramMap.has('volID'))	{			// 'postId' found in app-routing ...edit/:postId...
				this.mode = 'Edit';
				this.volunteerId = this.nullToString( paramMap.get('volID' ) );   // will be string
				this.isLoading = true;  //start spinner when requesting something.  html will look for this variable
				this.volunteersService.getOneVolunteer(this.volunteerId).subscribe(volunteerData => {
					this.isLoading = false;   //stop spinner when received something
					this.volunteer = {
						id: volunteerData._id, 
						firstName: volunteerData.firstName,
						lastName: volunteerData.lastName,
						email: volunteerData.email,
						phoneNumber: volunteerData.phoneNumber,
						address: volunteerData.address,
						intake: volunteerData.intake,
						// roles: {
						// 	footCanvass: volunteerData.roles.footCanvass,
						// 	phoneCanvass: volunteerData.roles.phoneCanvass,
						// 	office: volunteerData.roles.office,
						// 	hosting: volunteerData.roles.hosting,
						// 	events: volunteerData.roles.events,
						// 	smc: volunteerData.roles.smc,
						// 	signposter: volunteerData.roles.signposter,
						// 	photographer: volunteerData.roles.photographer,
						// 	core: volunteerData.roles.core
						// },
						notes: volunteerData.notes
					};
					this.volunteerFormGroup.setValue({
						'firstName': this.volunteer.firstName, 
						'lastName': this.volunteer.lastName,
						"email": this.volunteer.email,
						"phoneNumber": this.volunteer.phoneNumber,
						"address": this.volunteer.address,
						// "intake": this.volunteer.intake,
						// "roles": {
						// 	"footCanvass": this.volunteer.roles.footCanvass,
						// 	"phoneCanvass": this.volunteer.roles.phoneCanvass,
						// 	"office": this.volunteer.roles.office,
						// 	"hosting": this.volunteer.roles.hosting,
						// 	"events": this.volunteer.roles.events,
						// 	"smc": this.volunteer.roles.smc,
						// 	"signposter": this.volunteer.roles.signposter,
						// 	"photographer": this.volunteer.roles.photographer,
						// 	"core": this.volunteer.roles.core
						// },
						"notes": this.volunteer.notes
					});	//overrides values in form controls
					this.isLoading = false;
				});
			} else {
				this.mode = 'Create';
				this.volunteerId = '';
				this.isLoading = false;
			}
		});  // listen to changes in the url, and therefore update UI . check to see if any paramMap exists

	}

	ngOnDestroy() {
		//this.authStatusSub.unsubscribe();
	}

	onSaveVolunteer() {

		this.isLoading = true;

		if (this.volunteerFormGroup.invalid)
			return;

		if ( this.mode === 'Create') {
			this.volunteersService.saveNewVolunteer(this.volunteerFormGroup.value)
		}
		else
			this.volunteersService.updateVolunteer(this.volunteerId, this.volunteerFormGroup.value);

	}

	nullToString( value: null | string ): string {
		return value == null ? "" : value.toString();
	}
}