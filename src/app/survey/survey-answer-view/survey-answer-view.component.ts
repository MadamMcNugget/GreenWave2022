import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';	// if this 'page' is not part of the DOM, we want to stop subscriptions as well, cuz will cause memory leak
import { Question } from '../questions/question.model';
import { Survey } from '../survey.model';
import { SurveyAnswer } from '../survey-answer.model';
import { Voter } from '../voter.model';
import { AuthService } from '../../auth/auth.service';
import { SurveyService } from '../survey.service';
import { QuestionService } from '../questions/questions.service';

import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from "@angular/material/paginator";

@Component({
	selector: 'app-survey-answer-view',
	templateUrl: './survey-answer-view.component.html',
	styleUrls: ['./survey-answer-view.component.css']
})

export class SurveyAnswerViewComponent implements OnInit,  OnDestroy {
	/*posts = [
		{title: 'first post', content: 'First post\'s content'},
		{title: 'second post', content: 'Second post\'s content'},
		{title: 'third post', content: 'Third post\'s content'}
	]; */

	voters: Voter[] = [];
	question!: Question; 
	questions:Question[] = [];
	isLoading = false;
	manualCount!: number;
	canvassedTodayCount!: number;
	completeCount!: number;
	userStatus!: string;
 
	//for paginator
	totalVoters = 0; //dummy value
	votersPerPage = 10;
	currentPage = 1;
	pageSizeOptions = [5,10,25,50];

	constructor(
		private authService: AuthService, 
		public surveyService: SurveyService,
		public questionService: QuestionService,
		private _snackBar: MatSnackBar 
	) {}
	

	ngOnInit () {
		// recommended to do basic initialization tasks here

		this.isLoading = true;   
		this.userStatus = this.nullToString( localStorage.getItem('userStatus') );
		this.surveyService.getAnsweredVoters(this.votersPerPage, this.currentPage ).subscribe( data => {
			this.voters = data.voters;
			this.manualCount = data.manualCount;
			this.canvassedTodayCount = data.canvassedTodayCount;
			this.completeCount = data.completeCount;
			this.totalVoters = data.totalCount;
			this.isLoading = false;
		});
	}

	ngOnDestroy () {
		//this.surveySub.unsubscribe();
	}

	updateToGVote() {
		this.surveyService.updateToGVote(this.voters).subscribe( data => {
			let snackBarRef = this._snackBar.open("GVote has been updated! Anything left over needs manual input.", "Ok")
			this.surveyService.getAnsweredVoters(this.votersPerPage, this.currentPage).subscribe( data => {
				this.voters = data.voters;
				this.totalVoters = data.totalCount;
				this.isLoading = false;
			});
		});
	}

	finish(voter:Voter, index: number) {
		if (this.voters[index].needsManualEntry){
			this.voters[index].needsManualEntry = false;
			this.manualCount--;
		}
		if (this.voters[index].status !== '3complete'){
			this.voters[index].status = '3complete';
			this.completeCount++;
			this.canvassedTodayCount--;
		}
		this.surveyService.updateVoter(voter.id);
		this.surveyService.getAnsweredVoters(this.votersPerPage, this.currentPage );
	}

	onChangedPage(pageData: PageEvent) {
		this.isLoading = true;
		this.currentPage = pageData.pageIndex + 1;
		this.votersPerPage = pageData.pageSize;
		this.surveyService.getAnsweredVoters(this.votersPerPage, this.currentPage).subscribe( data => {
			this.voters = data.voters;
			this.isLoading = false;
		});

	}

	nullToString( value: string | null ): string {
		return value == null ? '' : value;
	}

}