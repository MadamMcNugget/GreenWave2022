import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from 'rxjs';	// if this 'page' is not part of the DOM, we want to stop subscriptions as well, cuz will cause memory leak
import { AuthService } from '../../auth/auth.service';
import { Volunteer } from '../volunteer.model';
import { VolunteersService } from '../volunteers.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';

@Component( {
	selector: 'app-volunteers-view',
	templateUrl: './volunteers-view.component.html',
	styleUrls: [ './volunteers-view.component.css' ]
} )

export class VolunteersViewComponent implements OnInit, OnDestroy {

	volunteers: Volunteer[] = [];
	displayedColumns: string[] = [
		"firstName",
		"lastName",
		"email",
		"phoneNumber",
		"address",
		// "intake",
		// "footCanvass",
		// "phoneCanvass",
		// "office",
		// "hosting",
		// "events",
		// "smc",
		// "signposter",
		// "photographer",
		// "core",
		"notes",
		"edit",
		"delete"
	];
	dataSource!: MatTableDataSource<Volunteer>;

	private volunteersSub: Subscription = new Subscription;
	isLoading = false;
	private authStatusSub: Subscription = new Subscription;
	userIsAuthenticated = false;
	userId: string | null = '';
	userStatus: string | null = '';

	//for paginator
	totalOrders = 0; //dummy value
	ordersPerPage = 5;
	currentPage = 1;
	pageSizeOptions = [ 10, 25, 50 ];

	@ViewChild( MatSort ) sort!: MatSort;
	@ViewChild( MatPaginator ) paginator!: MatPaginator;

	constructor (
		private authService: AuthService,
		public volunteersService: VolunteersService,
		private _snackBar: MatSnackBar
	) { }		// may create postlist using contructor, but can also use an Angular life cycle hook: OnInit


	ngOnInit() {
		// recommended to do basic initialization tasks here
		this.isLoading = true;

		this.volunteersService.getAllVolunteers();
		this.volunteersSub = this.volunteersService.getVolunteersUpdatedListener().subscribe( data => {
			this.volunteers = data.volunteers;
			this.dataSource = new MatTableDataSource( this.volunteers );
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.isLoading = false
		} )

		this.userId = this.authService.getUserId();
		this.userStatus = this.authService.getUserStatus();

		this.userIsAuthenticated = this.authService.getIsAuth();
		this.authStatusSub = this.authService.getUserAuthListener().subscribe( isAuthenticated => {
			this.userIsAuthenticated = isAuthenticated.authStatus;
			this.userStatus = isAuthenticated.userStatus;
			this.isLoading = false
		} );


	}

	onDelete( volID: string, fName: string, lName: string ) {

		let snackBarRef = this._snackBar.open( "Are you sure you want to delete " + fName + " " + lName + " as a volunteer?", "Yes", {
			duration: 5000,
			panelClass: [ 'warn-snackbar' ]	// style for this can be found in src/style.css
		} )

		snackBarRef.onAction().subscribe( () => {
			this.isLoading = true;
			this.volunteersService.deleteVolunteer( volID ).subscribe( () => {		//execute when post gets deleted
				this.volunteersService.getAllVolunteers(); //		this.ordersPerPage, this.currentPage);
			}, () => {
				this.isLoading = false;
			} );
		} )

	}

	ngOnDestroy() {
		this.volunteersSub.unsubscribe();
		//this.authStatusSub.unsubscribe();
	}

	applyFilter( filterEvent: Event ) {
		let filterValue = ( filterEvent.target as HTMLInputElement ).value;
		filterValue = filterValue.trim().toLowerCase();  // Datasource defaults to lowercase matches
		this.dataSource.filter = filterValue;
	}
}