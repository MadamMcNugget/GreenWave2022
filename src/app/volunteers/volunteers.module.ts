import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { VolunteersCreateComponent } from './volunteers-create/volunteers-create.component';
import { VolunteersViewComponent } from './volunteers-view/volunteers-view.component';

import { AngularMaterialModule } from './../angular-material.module';

@NgModule( {
	declarations: [
		VolunteersCreateComponent,
		VolunteersViewComponent
	],
	imports: [
		CommonModule,
		AngularMaterialModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule
	]
} )
export class VolunteersModule { }
