import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { SurveyCreateComponent } from './survey/survey-create/survey-create.component';
import { SurveyViewComponent} from './survey/survey-view/survey-view.component';
import { SurveyAnswerViewComponent} from './survey/survey-answer-view/survey-answer-view.component';
import { VolunteersCreateComponent } from './volunteers/volunteers-create/volunteers-create.component';
import { VolunteersViewComponent } from './volunteers/volunteers-view/volunteers-view.component';
// import { VolunteersEmailComponent } from './volunteers/volunteers-email/volunteers-email.component'; 
// import { PollsAddComponent } from './survey/polls-add/polls-add.component';
import { HomepageComponent } from './homepage/homepage.component';
import { UsersViewComponent } from './auth/users-view/users-view.component';
import { FindVotersComponent } from './survey/find-voters/find-voters.component';

const routes: Routes = [
	{ path: '', component: HomepageComponent },
	{ path: 'users/view', component: UsersViewComponent, canActivate: [AuthGuard] },
	{ path: 'survey/create', component: SurveyCreateComponent, canActivate: [AuthGuard] },
	{ path: 'survey/view', component: SurveyViewComponent, canActivate: [AuthGuard]  },
	{ path: 'surveyanswer/view', component: SurveyAnswerViewComponent, canActivate: [AuthGuard]  },
	{ path: 'volunteers/create', component: VolunteersCreateComponent, canActivate: [AuthGuard]  },
	{ path: 'volunteers/view', component: VolunteersViewComponent, canActivate: [AuthGuard]  },
	{ path: 'volunteers/edit/:volID', component: VolunteersCreateComponent, canActivate: [AuthGuard]  },
	// { path: 'volunteers/email', component: VolunteersEmailComponent, canActivate: [AuthGuard]  },
	// { path: 'polls/add', component: PollsAddComponent, canActivate: [AuthGuard] },
	{ path: 'voters/find', component: FindVotersComponent, canActivate: [AuthGuard] },
	{ path: 'voter/canvass/:id', component: SurveyViewComponent, canActivate: [AuthGuard]  },
	{
		path: 'auth', loadChildren: () => import( "./auth/auth.module" ).then( m => m.AuthModule
		)
	}	// this will be loaded lazily, loadChildren starts at current folder
];

@NgModule( {
	imports: [ RouterModule.forRoot( routes ) ],
	exports: [ RouterModule ],
	providers: [ AuthGuard ]	// usually shouldn't use 'providers', but for guards its fine
} )

export class AppRoutingModule { }