import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';	// if this 'page' is not part of the DOM, we want to stop subscriptions as well, cuz will cause memory leak
import { Voter } from '../../voters/voter.model';
import { SurveyService } from '../survey.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "src/app/auth/auth.service";

@Component({
	selector: 'app-find-voters',
	templateUrl: './find-voters.component.html',
	styleUrls: ['./find-voters.component.css']
})

export class FindVotersComponent implements OnInit,  OnDestroy {

	voters: Voter[] = [];	// voters thats been searched up
	private votersSub: Subscription = new Subscription;
	isLoading = false;
	dataSource = new MatTableDataSource();
	displayedColumns: string[] = [
		'name',
		'address',
		'canvass'
	]
	houseNum:string = '';
	street:string = '';
	searchedVoters = '';

	//for paginator
	totalOrders = 0; //dummy value
	ordersPerPage = 5;
	currentPage = 1;
	pageSizeOptions = [10, 25, 50];

	@ViewChild( MatSort ) sort!: MatSort;
	@ViewChild( MatPaginator ) paginator!: MatPaginator;

	constructor( 
		private _snackBar: MatSnackBar, 
		public surveyService: SurveyService, 
		private router: Router ,
		private authService: AuthService
	) {}		// may create postlist using contructor, but can also use an Angular life cycle hook: OnInit

	ngOnInit () {

		this.street = this.nullToString( sessionStorage.getItem('street') );
		this.houseNum = this.nullToString( sessionStorage.getItem('houseNum') );
		if ( this.houseNum === "null" )
			this.houseNum = "";
		if( sessionStorage.getItem('searchedVoters') ) {
			this.voters = JSON.parse( this.nullToString( sessionStorage.getItem('searchedVoters') ) );
		}

		if(this.voters) {
			var justCanvassed = this.surveyService.getJustCanvassed();
			if(justCanvassed){
				console.log( 'just canvassed', justCanvassed );
				var vIndex: number = this.voters.findIndex( x => x.id = justCanvassed!.id);
				justCanvassed.canvassedDate = new Date();
				justCanvassed.canvassedBy = this.authService.getUserEmail();
				this.voters[vIndex] = justCanvassed;
				sessionStorage.setItem('searchedVoters', JSON.stringify(this.voters));
			}
			this.dataSource.data = this.voters;
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
		}

		this.dataSource.filterPredicate = (data:any, filter: string): boolean => {
			var d = data.aptNum + "-" + data.houseNum;
		    return d.includes(filter);
		};
		
		// this.applyFilter(this.houseNum);
		// this.dataSource.filterPredicate = function( data: any , filter: string ): boolean {
		// 	return data.propertyAddress.toLowerCase().includes( filter)
		// }
		this.dataSource.filter = this.houseNum;
	}

	search(street:string) {

		var splitStreet = street.split(' ');
		var correctedStreet = "";
		for ( var i = 0 ; i < splitStreet.length ; i++ ){
			if ( Number.isNaN( Number(splitStreet[i])) )	// if not number
			{
				splitStreet[i] = splitStreet[i].charAt(0).toUpperCase() + splitStreet[i].substr(1).toLowerCase();
			}

			if ( i===0)
				correctedStreet = correctedStreet + splitStreet[i];
			else 
				correctedStreet = correctedStreet + " " + splitStreet[i];
		}

		street = correctedStreet;

		this.isLoading = true;
		this._snackBar.open( "Please wait... This may take a few seconds", "close");
		this.surveyService.searchVoterbyStreet(street);
		this.votersSub = this.surveyService.getSearchedVotersUpdatedListener().subscribe( voters => {
			this.voters = voters.voters;
			console.log( 'voters: ', this.voters );
			if (this.voters.length !== 0 ) {
				this._snackBar.open( "Done! Found " + voters.voters.length + " voters.", "close", {duration: 5000});
				this.dataSource.data = this.voters;
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
				this.houseNum = "";
				// this.applyFilter("");
				this.dataSource.filter = '';
				sessionStorage.setItem('street', street);
				sessionStorage.setItem('searchedVoters', JSON.stringify(this.voters));
			} else {
				this._snackBar.open( "No voters found.", "close", {duration: 5000});
			}
			this.isLoading = false;

		});
	}

	clearVoters() {
		sessionStorage.removeItem('street');
		sessionStorage.removeItem('searchedVoters');
		this.voters = [];
		this.dataSource.data = [];
	}

	getAllVoters() {
		this.isLoading = true;
		this.surveyService.getAllVoters();
		this.votersSub = this.surveyService.getVotersUpdatedListener().subscribe( data => {
			this.voters = data.voters;
			this.dataSource.data = this.voters;
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.isLoading = false;
		});
	}

	canvass(voter:any, houseNum:string) {
		sessionStorage.setItem('houseNum', houseNum);
		this.router.navigate(["/voter/canvass/" + voter._id]);
	}

	numOfStars(support:string) {
		var level;
		if (support.includes('Strong Green'))
			level = 5;
		else if (support.includes('Weak Green'))
			level = 4;
		else if (support.includes('Undecided'))
			level = 3;
		else if (support.includes('Weak Opposition'))
			level = 2;
		else if (support.includes('Strong Opposition'))
			level = 1;
		else
			level = 0;

		return Array(level);
	}

	supportLevel(support:string){
		var level;
		if (support.includes('Strong Green'))
			level = 1;
		else if (support.includes('Weak Green'))
			level = 2;
		else if (support.includes('Undecided'))
			level = 3;
		else if (support.includes('Weak Opposition'))
			level = 4;
		else if (support.includes('Strong Opposition'))
			level = 5;
		else
			level = 0;

		return level;
	}

	ngOnDestroy () {
		if (this.votersSub)
			this.votersSub.unsubscribe();
	}

	applyFilter(event: Event) {
		let filterEvent = (event.target as HTMLInputElement).value;
		let filterValue = filterEvent.trim().toLowerCase(); // Datasource defaults to lowercase matches
		this.dataSource.filter = filterValue;
		
	}

	nullToString( value: null | string ): string {
		return value == null ? "" : value.toString();
	}
}