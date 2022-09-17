import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';	// if this 'page' is not part of the DOM, we want to stop subscriptions as well, cuz will cause memory leak
import { MatStepper } from '@angular/material/stepper';
import { Survey } from '../survey.model';
import { AuthService } from '../../auth/auth.service';
import { SurveyService } from '../survey.service';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { Voter } from "../../voters/voter.model";
import { Question } from "../questions/question.model";

@Component( {
	selector: 'app-survey-view',
	templateUrl: './survey-view.component.html',
	styleUrls: [ './survey-view.component.css' ]
} )

export class SurveyViewComponent implements OnInit, OnDestroy {
	/*posts = [
		{title: 'first post', content: 'First post\'s content'},
		{title: 'second post', content: 'Second post\'s content'},
		{title: 'third post', content: 'Third post\'s content'}
	]; */

	survey!: Survey;	//survey we got from database. This view only views newest survey
	surveyForm: FormGroup = new FormGroup( {} );
	questionIDs: string[] = [];
	private surveySub: Subscription = new Subscription;
	private geoSub: Subscription = new Subscription;
	@ViewChild( 'stepper' ) stepper!: MatStepper;
	isLoading = false;
	voterLoad = false;
	surveyLoad = false;
	voterId: string = '';
	voter!: Voter;
	canvasserEmail: string = '';

	//for paginator
	totalOrders = 0; //dummy value
	ordersPerPage = 5;
	currentPage = 1;
	pageSizeOptions = [ 1, 2, 5, 10 ];

	constructor ( private authService: AuthService, public surveyService: SurveyService, public route: ActivatedRoute ) { }		// may create postlist using contructor, but can also use an Angular life cycle hook: OnInit


	ngOnInit() {
		// recommended to do basic initialization tasks here

		this.isLoading = true;
		this.voterLoad = true;
		this.surveyLoad = true;

		this.canvasserEmail = this.authService.getUserEmail();

		this.route.paramMap.subscribe( ( paramMap: ParamMap ) => {
			if ( paramMap.has( 'id' ) ) {			// 'postId' found in app-routing ...edit/:postId...
				this.voterId = this.nullToString( paramMap.get( 'id' ) );
				this.surveyService.getOneVoter( this.voterId ).subscribe( ( voter: { voter: any } ) => {
					let transformedVoter: Voter = { ...voter.voter, id: voter.voter._id };
					console.log( "getting voter", transformedVoter );
					this.voter = transformedVoter;
					this.voterLoad = false;
					this.checkIfLoading();
				} );

			}
		} )

		if ( sessionStorage.getItem( 'survey' ) ) {	// if there is survey in session
			console.log( 'survey is in storage' );
			this.survey = JSON.parse( this.nullToString( sessionStorage.getItem( 'survey' ) ) );
			for ( var s = 0; s < this.survey.section.length; s++ ) {
				for ( var q = 0; q < this.survey.section[ s ].questions.length; q++ ) {
					this.surveyForm.addControl( this.survey.section[ s ].questions[ q ].id!, new FormControl( null ) );
					this.questionIDs.push( this.survey.section[ s ].questions[ q ].id! );
				}
			}
			this.surveyLoad = false;
			this.checkIfLoading();
		} else {	// if no survey in session, then get new survey
			console.log( 'survey not in storage, grabbing new survey' );
			this.surveyService.getNewestSurvey();
			this.surveySub = this.surveyService.getSurveyUpdateListener().subscribe( ( surveyData: { survey: Survey } ) => {
				this.survey = surveyData.survey;
				sessionStorage.setItem( 'survey', JSON.stringify( this.survey ) );

				//create the 'form' for user side
				for ( var s = 0; s < this.survey.section.length; s++ ) {
					for ( var q = 0; q < this.survey.section[ s ].questions.length; q++ ) {
						this.surveyForm.addControl( this.survey.section[ s ].questions[ q ].id!, new FormControl( null ) );
						this.questionIDs.push( this.survey.section[ s ].questions[ q ].id! );
					}
				}
				this.surveyLoad = false;
				this.checkIfLoading();
			} );
		}
	}

	checkIfLoading(){
		if( !this.voterLoad && !this.surveyLoad ){
			this.isLoading = false;
		}
	}

	ngOnDestroy() {
		//this.postsSub.unsubscribe();
		//this.authStatusSub.unsubscribe();
		//this.surveySub.unsubscribe();
	}

	setStep( section: number, index: number ) {
		this.survey.section[ section ].step = index;
	}

	nextStep( section: number ) {
		this.survey.section[ section ].step++;
	}

	prevStep( section: number ) {
		this.survey.section[ section ].step--;
	}

	// returns 'end', 'goto', or 'next'
	nextAction( section: number, questionID: string, responseID: string ) {
		var qIndex = this.survey.section[ section ].questions.map( function ( x ) { return x.id } ).indexOf( questionID );
		if ( this.survey.section[ section ].questions[ qIndex ].gotoEnabled === true ) {
			if ( responseID ) {
				var rIndex = this.survey.section[ section ].questions[ qIndex ].responses.map( function ( x ) { return x.id } ).indexOf( responseID );
				if ( this.survey.section[ section ].questions[ qIndex ].responses[ rIndex ].goto === 'end' ) {
					return 'end';
				} else if ( this.survey.section[ section ].questions[ qIndex ].responses[ rIndex ].goto === 'none' ) {
					return 'next';
				} else {
					return this.survey.section[ section ].questions[ qIndex ].responses[ rIndex ].goto;
				}
			} else {
				return 'next';
			}
		} else {
			return 'next';
		}
	}

	goto( nextQ: string ) {
		var q = nextQ.split( " " );
		console.log( q[ 0 ] );
		var section = <number><unknown>q[ 0 ] - 1;
		var question = <number><unknown>q[ 1 ] - 1;
		this.survey.section[ section ].step = question;
		this.stepper.selectedIndex = section;
	}

	finishSurvey() {
		this.isLoading = true;
		const QnA = [];
		for ( var i = 0; i < this.questionIDs.length; i++ ) {
			var res = this.surveyForm.get( this.questionIDs[ i ] )!.value;
			QnA.push( { questionID: this.questionIDs[ i ], response: res } );
			//var qIndex = this.survey.section[section].questions.map( function(x) {return x.id}).indexOf(questionID);

			//update support lvl
			let lvl = '';
			if( this.questionIDs[ i ] == "63198d2a4c211f1af52f3928" )	{		// id of question with support level
				switch ( res ) {
					case 'cc':
							lvl = 'Strong Green';
						break;
					case 'dd':
							lvl = 'Weak Green';
						break;
					case 'ee':
							lvl = 'Undecided';
						break;
					case 'ff':
							lvl = 'Weak Opposition';
						break;
					case 'gg':
							lvl = 'Strong Opposition';
						break;
					default:
						break;
				}
				this.voter.support = lvl;
			} 
		}
		this.surveyService.addSurveyAnswer( this.voter, this.canvasserEmail, QnA );
	}

	nullToString( value: string | null ): string {
		return value == null ? '' : value;
	}

}