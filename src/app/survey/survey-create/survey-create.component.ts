import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';	// if this 'page' is not part of the DOM, we want to stop subscriptions as well, cuz will cause memory leak
import { AuthService } from '../../auth/auth.service';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { QuestionCreateComponent } from '../questions/question-create/question-create.component';
import { MatDialog } from '@angular/material/dialog';
import { Question } from '../questions/question.model';
import { Survey } from '../survey.model';
import { QuestionService } from '../questions/questions.service';
import { SurveyService } from '../survey.service';

@Component({
	selector: 'app-survey-create',
	templateUrl: './survey-create.component.html',
	styleUrls: ['./survey-create.component.css']
})

export class SurveyCreateComponent implements OnInit,  OnDestroy {

	constructor(public dialog: MatDialog, public surveyService: SurveyService) {}

  isLoading = false;
  private surveySub: Subscription = new Subscription;
  survey!:Survey;
  createdQuestions!: Survey;

  defaultQuestions: Survey = 
  {
		"id": "AAA",
		"edittedBy": "default",
    "section": [
      {
        "id": "1",
        "title": "Are they a Supporter?",
				"step": 1,
        "questions": [
          { 
            "id": "a",
            "question": "Is the resident home?", 
            "responseType": "Multiple Choice", 
            "responses": [
              { "id": "aa", "response": "Yes", "goto": "none" },
              { "id": "bb", "response": "No", "goto": "end" }
            ], 
            "gotoEnabled": true,
            "edittable": false 
          },
          { 
            "id": "b",
            "question": "Support Level", 
            "responseType": "Multiple Choice", 
            "responses": [
              { "id": "cc", "response": "Strong Green", "goto": "none" },
              { "id": "dd", "response": "Weak Green", "goto": "none" },
              { "id": "ff", "response": "Undecided", "goto": "none" },
              { "id": "gg", "response": "Weak Opposition", "goto": "none" },
              { "id": "hh", "response": "Strong Opposition", "goto": "none" }
            ], 
            "gotoEnabled": false,
            "edittable": false 
          },
          { 
            "id": "c",
            "question": "Favourite food?", 
            "responseType": "Checkbox", 
            "responses": [
              { "id": "ii", "response": "sushi", "goto": "none" },
              { "id": "jj", "response": "curry", "goto": "none" },
              { "id": "kk", "response": "pasta", "goto": "none" }
            ], 
            "gotoEnabled": false,
            "edittable": true  
          }
        ]
      },
      {
        "id": "2",
        "title": "Are they willing to help",
				"step": 2,
        "questions": [
          { 
            "id": "d",
            "question": "Sign Request", 
            "responseType": "Checkbox", 
            "responses": [
              { "id": "ll", "response": "Lawn", "goto": "none" },
              { "id": "mm", "response": "Window", "goto": "none" },
              { "id": "nn", "response": "Large", "goto": "none"}
            ], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "id": "e",
            "question": "Donation Pledge", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "id": "f",
            "question": "Do they want to help volunteer?", 
            "responseType": "Multiple Choice", 
            "responses": [
              { "id": "oo", "response": "Yes", "goto": "none" },
              { "id": "pp", "response": "No", "goto": "3 1" }
            ], 
            "gotoEnabled": true,
            "edittable": false 
          },
          { 
            "id": "g",
            "question": "Volunteer role", 
            "responseType": "Checkbox", 
            "responses": [
              { "id": "qq", "response": "Foot Canvass", "goto": "none" },
              { "id": "rr", "response": "Phone Canvass", "goto": "none" },
              { "id": "ss", "response": "Photography", "goto": "none"}
            ],
            "gotoEnabled": false,
            "edittable": false  
          }
        ]
      },
      {
        "id": "3",
        "title": "Getting Contact Info",
				"step": 3,
        "questions": [
          { 
            "id": "h",
            "question": "Email", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "id": "i",
            "question": "Phone Number", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          },
          { 
            "id": "j",
            "question": "Candidate Follow Up", 
            "responseType": "Text", 
            "responses": [], 
            "gotoEnabled": false,
            "edittable": false  
          }
        ]
      }
    ]
  }

  ngOnInit() {
    //this.createdQuestions = this.defaultQuestions;
    this.isLoading = true;
    this.surveyService.getNewestSurvey();
    this.surveySub = this.surveyService.getSurveyUpdateListener().subscribe( (surveyData: {survey: Survey}) => {
      if (surveyData.survey)
        this.createdQuestions = surveyData.survey;
      else
        this.createdQuestions = this.defaultQuestions;

      this.isLoading = false;
			console.log( 'survey got:', this.createdQuestions );
    })
  }

  ngOnDestroy() {
    this.surveySub.unsubscribe();
  }

  numberOfSections = 3;
  sectionWidth = "30%"; //(95/this.numberOfSections - 2*(this.numberOfSections-1)) + "%";

  drop(event: CdkDragDrop<Question[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
		}
	}

  getQuestions() {
    return this.createdQuestions;
  }

	getQuestion(index:number) {
		console.log("getting question at index:" + index);
	}

  editQuestion(section: number, index:number) {  
    let responses = [];
    for ( var i = 0 ; i < this.createdQuestions.section[section].questions[index].responses.length ; i++){
      responses.push(this.createdQuestions.section[section].questions[index].responses[i].response);
    }
    this.openQuestion('Edit',
        this.createdQuestions.section[section].questions[index].question,
        this.createdQuestions.section[section].questions[index].responseType,
        responses,
        section,
        index
      );
  }


  addQuestion(section:number) {
    this.openQuestion('Create', null, null, null, section);
  }

	openQuestion(mode: string, q?: string|null, rT?: string|null, r?: string[]|null, section?:number, index?:number) {
		const dialogRef = this.dialog.open(QuestionCreateComponent, {
			width: '50%',
      height: '80%',
      disableClose: true,
      data: { mode: mode, question: q, responseType: rT, responses: r, s: section, i: index, createdQuestions: this.createdQuestions}
		});

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.question && result.responseType) {
          const res: {id: null, response: string, goto: string}[] = [];
          for ( let i = 0 ; i<result.responses.length ; i++) {
            res.push({ id: null, response: result.responses[i], goto: "none"})
          }
          if (result.mode === "Create") {
            this.createdQuestions.section[section!].questions.push({
              "id": null,
              question: result.question,
              responseType: result.responseType,
              responses: res,
              gotoEnabled: false,
              edittable: true
            });
          } else if (result.mode === "Edit") {
            this.createdQuestions.section[result.section].questions[result.index] = {
              "id": null,
              question: result.question,
              responseType: result.responseType,
              responses: res,
              gotoEnabled: false,
              edittable: true
            };
          } else if (result.mode === "Delete") {
            console.log("delete");
            var qArray: { title: string, questions: Question[], id: string, step: number } = {
              title: this.createdQuestions.section[result.section].title,
              questions: [],
							id: "zz",
							step: 0
            };
            for ( var i = 0 ; i < result.index ; i++ ) {
              qArray.questions.push( this.createdQuestions.section[result.section].questions[i] );
            }
            for ( var i = <number>(result.index + 1) ; i < this.createdQuestions.section[result.section].questions.length ; i++ ) {
              qArray.questions.push( this.createdQuestions.section[result.section].questions[i] );
            }
            this.createdQuestions.section[result.section] = qArray;
          }
        } 
      } 
      
    })
	}

  // onSectionChange(event:Event) {
  //   this.numberOfSections = event.value
  //   this.sectionWidth = (95/this.numberOfSections - (this.numberOfSections-1)) + "%";
  // }

  getConnectedList(): any[] {
    return this.createdQuestions.section.map(x => `${x.id}`);
  }
  dropGroup(event: CdkDragDrop<Survey>) {
    moveItemInArray(this.createdQuestions.section, event.previousIndex, event.currentIndex);
  }
  dropItem(event: CdkDragDrop<Question[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }

  submitSurvey() {
    console.log(this.createdQuestions);
    this.surveyService.submitNewSurvey(this.createdQuestions);
  }

}