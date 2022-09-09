import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';  // is like eventemitter, but much broader than angular's eventemitter
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Question } from './questions/question.model';
import { Survey } from './survey.model';
import { Voter } from './voter.model';
import { AuthService } from '../auth/auth.service';
import { environment } from '../../environments/environment';

/*  Environment Variables
	- same as global variables
	- can only be used in angular project, not for backend, only frontend
	- backend uses NODE environment variables instead -> created nodemon.js in /begin
	- found in src/environments/environment.ts
	- BACKEND_URL to be saved as env. variable
*/
const BACKEND_URL = environment.apiUrl + '/surveys/';
const BACKENDPOLLS_URL = environment.apiUrl + '/polls/';

@Injectable	({providedIn: 'root'})  // may pass javascript object as parameter to configure
									// providedIn: 'root' - provides this services from the root level, and creates only 1 instance of this service to the entire app
 									// need for this post app as we only want 1 instance of posts rather than multiple copies with different arrays.
export class SurveyService {
	private surveyUpdated = new Subject<{survey: Survey}>();
	private questionUpdated = new Subject<{question: Question}>();
	private geoUpdated = new Subject<{geo: any}>();
	private userId!: string;
	private survey!: Survey;
	private surveys: Survey[] = [];
	private surveysUpdated = new Subject<{surveys: Survey[]}>();
	private currentPolls = [];
	private currentPollsUpdated = new Subject<{polls: any}>();
	private voters: Voter[] = [];
	private votersUpdated = new Subject<{voters: any}>();
	private searchedVoters = [];
	private searchedVotersUpdated = new Subject<{voters: any}>();
	private answeredVoters = [];
	private answeredVotersUpdated = new Subject<{voters: any}>();
	justCanvassed: Voter | null = null;	// voter just canvassed i think?

	constructor(
		private http: HttpClient, 
		private router: Router, 
		private authService: AuthService,
		private _snackBar: MatSnackBar
	) {} // eyy other services can be injected into other services too

	getAnsweredVoters(votersPerPage:number, currentPage:number) {

		const queryParams = `?pagesize=${votersPerPage}&page=${currentPage}`;
		
		return this.http
			.get<{
				message: string,
				totalCount: number,
				canvassedTodayCount: number,
				manualCount: number,
				completeCount: number, 
				voters: any
			}> (
				BACKENDPOLLS_URL + "voters/answered" + queryParams
			)  											
	}

	getAnsweredVotersUpdatedListener() {
		return this.answeredVotersUpdated.asObservable();
	}

	getSurveyUpdateListener() {
		return this.surveyUpdated.asObservable();
	}

	getNewestSurvey() {	//should always only have 1 survey. if not, get newest survey
		this.http.get<{message: string, survey: any}> (
			BACKEND_URL + "newest"
		)    // dont need to unsubscribe because for observables connected to features built into angular, unsubscription will be handled by angular.
		.pipe( map( (surveyData) => {	//map here is from rxjs. transforms every elemnt of an array into a new element and store them all back into a new array
			return {
				survey: surveyData.survey.map( ( survey: any ) => {  //we want to replace every post with a new javascript object
					return {
						id: survey.id,
						edittedBy: survey.edittedBy,
						section: survey.section.map( (sect:any, index:number) => {
							return {			
								title: sect.title,		
								step: 0,
								id: index,
								questions: sect.questions.map( ( quest:any ) => {
									return {
										question: quest.question,
										id: quest.id,
										responseType: quest.responseType,
										gotoEnabled: quest.gotoEnabled,
										edittable: quest.edittable,
										responses: quest.responses.map ( ( resp:any ) => {
											return {
												id: resp._id,
												response: resp.response,
												goto: resp.goto
											}
										})
									}
								})
							}
						})
					};	// so now every element in the array will be converted to an object which will be put back into a new array which is returned here. is then wrapped by observable
				})
			}; //map here is javascript. 
		}))
		.subscribe( (transformedPostsData) => {	// transformedPosts is result of map operations.
			this.survey = transformedPostsData.survey[0];
			//this.survey.section[this.survey.section.length-1].questions.push(this.lastQuestion);
			this.surveyUpdated.next({ survey: this.survey });	// inform other parts of app that we added a post
		}) 

//		return this.http.get<{message: string, surveys: any}>(BACKEND_URL) 		
	}

	getQuestion(questionID: string) {
		return this.http.get<{ 
			id: string,
			question: string, 
			responseType: string, 
			responses: string[],
			gotoEnabled: boolean,
			edittable: boolean }> 
		( BACKEND_URL + "question/" + questionID );
	}

	//submitNewSurvey: saves created survey to the backend
	submitNewSurvey(survey:any) {
		this.http.post<{message: string, survey: any }>(BACKEND_URL, survey)
		.subscribe( (responseData) => {
			this.router.navigate(["/survey/view"]);

		});
	}

	//finishSurvey: saves canvassed survey to backend
	addSurveyAnswer(voter:any, canvasserEmail:string, survey:any) {
		this.justCanvassed = voter;
		var voterAnswer = { voter: voter, canvassedBy: canvasserEmail, answers: survey}
		this.http.put<{message: string, voter: any }>(BACKENDPOLLS_URL + "voter", voterAnswer)
		.subscribe( data => {
			this.router.navigate(["/voters/find"]);

		});
	}

	getJustCanvassed(){
		return this.justCanvassed;
	}

	/*deletePost(postId: string) {
		return this.http.delete(BACKEND_URL + postId);
	}*/

	//--------------------------------------------------------------------------
	// poll related things

	// getCurrentPolls(){
	// 	this.http.get< string[] >(
	// 		BACKENDPOLLS_URL + 'current'
	// 	).subscribe( poll => {
	// 		console.log(poll);
	// 		this.currentPolls = poll;
	// 		this.currentPollsUpdated.next({ polls: this.currentPolls });
	// 	})
	// }

	// getCurrentPollsUpdatedListener() {
	// 	return this.currentPollsUpdated.asObservable();
	// }

	getAllVoters(){
		this.http.get<{message: string, voters: any[] } >(
			BACKENDPOLLS_URL + 'voters/all'
		).subscribe( voters => {
			console.log(voters);
			this.voters = voters.voters;
			this.votersUpdated.next({ voters: this.voters });
		})
	}

	getVotersUpdatedListener() {
		return this.votersUpdated.asObservable();
	}

	getOneVoter( voterID:string ){
		console.log('getting one voter');
		return this.http.get<{message: string, voter: any } >(
			BACKENDPOLLS_URL + 'voter/' + voterID
		)
	}

	// scrapes a poll from gvote
	// addPoll(p: string) {
	// 	this._snackBar.open("Adding poll# " + p + "... ", "Close", );
	// 	var poll = { poll: p }
	// 	this.http.post<{ message: string, voters: any[] }>(BACKENDPOLLS_URL, poll).subscribe( data => {
	// 		console.log(data);
	// 		if ( data.voters ) {
	// 			this.currentPolls.push(p);
	// 			this._snackBar.open("Added poll# " + p + " - Number of voters added: " + data.voters.length + ".", "Please Refresh Page", );
	// 			this.currentPollsUpdated.next({ polls: this.currentPolls });
	// 		} else {
	// 			this._snackBar.open(data.message, "Refresh Page", );
	// 			this.currentPollsUpdated.next({ polls: this.currentPolls });
	// 		}

	// 	});
	// }

	// update canvassed information to gvote
	updateToGVote(voters:any) {
		console.log(voters);

		return this.http.post<{ message: string }>(BACKENDPOLLS_URL + 'updateToGVote', voters);
	}

	deletePoll(poll: string) {
		var p = { poll: poll }
		return this.http.delete(BACKENDPOLLS_URL + "poll/" + poll).subscribe( data => {
			this.currentPolls = this.currentPolls.filter( item => item !== poll);
			console.log(this.currentPolls);
			console.log(data);
			this._snackBar.open("Deleted poll# " + poll, "Please Refresh Page", );
			this.currentPollsUpdated.next({ polls: this.currentPolls });
		});
	}

	updateVoter(voterid:string) {
		var data = { 
			voterId: voterid,
			status: 'complete' 
		};
		return this.http.put(BACKENDPOLLS_URL + "voter/complete", data).subscribe( data => {
			console.log(data);
		})
	}

	//-------------------------------------------------
	// search voter by street

	searchVoterbyStreet(street:any) {
		console.log(street);
		this.http.get<{message: string, voters: any}> (
			BACKENDPOLLS_URL + "voters/findbystreet/" + street
		)
		.subscribe( (voterData) => {	// transformedPosts is result of map operations.
			if(voterData.voters){
				console.log( 'voter data returned: ', voterData.voters );
				let transformedVotersData = voterData.voters.map( ( voter: any ) => ({ ...voter, id: voter._id }) );
				console.log( 'transformed voter data: ', transformedVotersData );
				this.searchedVoters = transformedVotersData;
				this.searchedVotersUpdated.next({ voters: [...this.searchedVoters] });	// inform other parts of app that we added a survey
			} else {
				this.searchedVotersUpdated.next({ voters: [] });
			}
		});  
	}

	getSearchedVotersUpdatedListener() {
		return this.searchedVotersUpdated.asObservable();
	}
}