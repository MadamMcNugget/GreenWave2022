// in typescript, we can create a new component by creating a new class
// class allows us to create a blueprint for an object, who we will not create that object on our own, its done by angular. we just define what it will look like

//include decorator with '@' to turn class into code that angular understands. needs to be imported

import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Question } from '../question.model';
import { QuestionService } from '../questions.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';

@Component({    // Component object takes soem configurationg which comes in the form of a javascript object which we pass to it.
	selector: 'app-question-create',     // selector allows us to use this component
	templateUrl: './question-create.component.html',     // can pass plain html ( such as '<h1> A header </h1>' ), but not ideal for bigger files.
	styleUrls: ['./question-create.component.css']
})

export class QuestionCreateComponent implements OnInit, OnDestroy {    // PostCreateComponent is name, convention to use filename + component with caps of 1st letter of each word
	
	questionCreateForm!: FormGroup;	//groups all controls of a form, can have subgroups
	responses!: FormArray;
	responsesArray!: FormControl;
	responseTypes = [
		"Multiple Choice",
		"Checkbox",
		"Text"
	];

	q: string | null = null;
	rT: string | null  = null;
	r: [string] | null  = null;

	public questionSubmitPressed = false;

	enteredTitle = '';
	enteredContent = '';  // declare variables with just a name
	post!: Question;
	isLoading = false;
	imagePreview!: string;
	private mode = 'create';
	private postId!: string;
	private authStatusSub!: Subscription;

	//@Output() postCreated = new EventEmitter<Post>();   // @Output turns postCreated to something that can be listened from outside.  EventEmitter is generic type, add <Post> to set as post

	constructor(
		public questionService: QuestionService, 
		public route: ActivatedRoute, 
		private authService: AuthService,
		public dialogRef: MatDialogRef<QuestionCreateComponent>,
		public dia: MatDialog,
		@Inject(MAT_DIALOG_DATA) public data: {mode: string, question: string, responseType:string, responses: [string], s: number, i: number, createdQuestion: any} 
	) {}  //want to reach postsService not onInit, but whenever new post is created. with this, we dont need eventemitter and output anymore

	ngOnInit() {	// extract whether we are create new post or editting old. if have postID, then edit, otherwise is create

		if(this.data.question)
			this.q = this.data.question;
		if(this.data.responseType)
			this.rT = this.data.responseType;
		else
			this.rT = "Multiple Choice";

		this.authStatusSub = this.authService.getAuthStatusListener().subscribe( authStatus => {
			this.isLoading = false;
		});
		this.questionCreateForm = new FormGroup({
			'question': new FormControl(this.q, {	// only null if in create, if edit, change in subscriptions
				validators: [Validators.required]     // FormControl( BeginningFormState, Validator/FormControlOptions-is javascript opject)
			}),
			'responseType': new FormControl(this.rT, {		// use chooses between ['Checkbox','Radio', 'text', 'Ranked' if i can implement it]
				validators: [Validators.required]
			}),
			'responses': new FormArray([
				this.addResponseFormGroup()
			])
		});

		if(this.data.responses) {
			for ( var i = 1 ; i < this.data.responses.length ; i++)
				this.addResponse(this.data.responses[i]);
		}
	}

	addResponseFormGroup(): FormControl {
		const responses = this.data.responses;
		if (!responses) {	//create question
			return new FormControl(null);	// validation?
		} else {			//edit question
			if (responses.length < 1) {
				return new FormControl(null);
			} else {
				return new FormControl(responses[0]);
			}
		}
	}

	addResponse(response?:string | null) {
		if (!response) {
			response = null;
		} 

		(<FormArray>this.questionCreateForm.get( 'responses' )).push(new FormControl(response));
	}

	getResponseControls(): FormControl[] {
		return <FormControl[]>(<FormArray>this.questionCreateForm.get( 'responses' ))['controls'];
	}

	removeResponse(index: number) {
		(<FormArray>this.questionCreateForm.get( 'responses' )).removeAt(index);
	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe();
	}

	deleteQuestion() {
		this.data.mode = "Delete"
	}

	cancelSave() {
		this.dia.closeAll();
	}

}
