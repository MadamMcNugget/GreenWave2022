/* Services 
		- is type of class in angular which allows injection
		- are ways to pass data around easier, an alternative
		- centralize some tasks and provide easy access to data from within differenc components without property and event binding.

	 Depencency Injection
			- where one object supplies the dependencies of another object. 
			- to go component you want posts in (post-list), create constructor
			- can add this service to app.module.ts under provider OR include @Injectable here

			Interceptors
			- is a function that runs on any outgoing http request
			- in our case, we want to add the json token to each header
*/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';  // is like eventemitter, but much broader than angular's eventemitter
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { Question } from './question.model';
import { environment } from '../../../environments/environment';

/*  Environment Variables
	- same as global variables
	- can only be used in angular project, not for backend, only frontend
	- backend uses NODE environment variables instead -> created nodemon.js in /begin
	- found in src/environments/environment.ts
	- BACKEND_URL to be saved as env. variable
*/
const BACKEND_URL = environment.apiUrl + '/questions/';

@Injectable( { providedIn: 'root' } )  // may pass javascript object as parameter to configure
// providedIn: 'root' - provides this services from the root level, and creates only 1 instance of this service to the entire app
// need for this post app as we only want 1 instance of posts rather than multiple copies with different arrays.
export class QuestionService {
	submitted: boolean = false;

	private questions: { question: string, responseType: string, responses: string[] }[] = [];
	private questionUpdated = new Subject<{ question: string, responseType: string, responses: [ string ] }>();
	private questionsUpdated = new Subject<{ questions: any }>();

	constructor ( private http: HttpClient, private router: Router ) { } // eyy other services can be injected into other services too

	getQuestionUpdateListener() {
		return this.questionsUpdated.asObservable();
	}

	addQuestion( question: string, responseType: string, responses: [ string ] ) {  // can also to post: Post

		this.questions.push( { question: question, responseType: responseType, responses: responses } );
		this.questionUpdated.next( { question: question, responseType: responseType, responses: responses } );

		/*
		const questionData = new FormData();	// javascript form data allows text and file values
		questionData.append("question", question);
		questionData.append("responseType", responseType);
		questionData.append("responses", JSON.stringify(responses));

		for (var i = 0; i < responses.length; i++) {
			questionData.append("responses[]", responses[i]);
			console.log("appending response " + i);	
		}
		console.log("questions service to add question");
		console.log(responses);
		console.log(questionData.get('responses'));
		console.log(BACKEND_URL);
		this.http.post<{message: string, question: Question }>(BACKEND_URL, questionData)
			.subscribe( (responseData) => {
				console.log("adding question to database");
				console.log(responseData);
				//this.router.navigate(["/"]);
			})*/
	}

	getQuestions( postsPerPage?: number, currentPage?: number ) {
		//return [...this.posts];		// since posts is reference type rather than a primitive, if external functions change posts, it also changes original cuz it copied the address.
		// to negate that, use spread operator by including [... ] around this.posts to create new array.
		// dont have to do this, but is good practice to be immutable and lets ppl know you don't want this edited.
		// in addPost, we getPosts first (which is copy of empty array), then add new post to copied array, therefore it achieves nothing.
		// To fix this, we can use event-driven approach -> Subject from rxjs package. it is a package of observables, objects that help pass data around.

		const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;	// not ' but ` (backtick) - javascript feature that allows us to dynamically add values into a normal string

		this.http
			.get<{ message: string, posts: any, maxPosts: number }>(
				BACKEND_URL + "questions" //queryParams
			)    // dont need to unsubscribe because for observables connected to features built into angular, unsubscription will be handled by angular.
			.pipe( map( ( questionData ) => {	//map here is from rxjs. transforms every elemnt of an array into a new element and store them all back into a new array
				return {
					questions: questionData.posts.map( ( question:any ) => {  //we want to replace every post with a new javascript object
						return {
							id: question._id,
							question: question.question,
							responeses: question.responses
						};	// so now every element in the array will be converted to an object which will be put back into a new array which is returned here. is then wrapped by observable
					} )
				}; //map here is javascript. 
			} ) )
			.subscribe( ( transformedPostsData ) => {	// transformedPosts is result of map operations.
				console.log( "checking all questions...." );
				console.log( transformedPostsData );
				this.questions = transformedPostsData.questions;
				this.questionsUpdated.next( transformedPostsData );	// inform other parts of app that we added a post
			} );


	}

	setSubmitted( submit: boolean ) {
		this.submitted = submit;
	}
	getSubmitted(): boolean {
		return this.submitted;
	}
}