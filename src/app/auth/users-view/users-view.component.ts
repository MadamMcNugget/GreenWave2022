import { Component, OnInit, OnDestroy, ViewChild, Inject } from "@angular/core";
import { filter, Subscription } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormGroup, FormControl, FormArray, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AuthService } from '../../auth/auth.service';
import { AuthData } from '../auth-data.model';

@Component({
	selector: 'app-users-view',
	templateUrl: './users-view.component.html',
	styleUrls: ['./users-view.component.css']
})

export class UsersViewComponent implements OnInit,  OnDestroy {
	
	users: AuthData[] = [];
	displayedColumns:string[] = [
		"email",
		"status",
		"edit"
	];
	dataSource!: MatTableDataSource<AuthData>;

	private usersSub: Subscription = new Subscription;
	isLoading = false;
	private authStatusSub: Subscription = new Subscription;
	userIsAuthenticated = false;
	userId!: string;
	userStatus!: string;

	//for paginator
	totalOrders = 0; //dummy value
	ordersPerPage = 5;
	currentPage = 1;
	pageSizeOptions = [10,25,50];

	@ViewChild( MatSort ) sort!: MatSort
	@ViewChild( MatPaginator ) paginator!: MatPaginator;

	constructor( 
		private authService: AuthService,
		private _snackBar: MatSnackBar,
		public dialog: MatDialog
	 ) {}		// may create postlist using contructor, but can also use an Angular life cycle hook: OnInit
	

	ngOnInit () {
		// recommended to do basic initialization tasks here
		this.isLoading = true;

		this.authService.getAllUsers();
		this.usersSub = this.authService.getUsersUpdatedListener().subscribe( data => {
			this.users = data.users;
			this.dataSource = new MatTableDataSource(this.users);
			this.dataSource.sort = this.sort;
			this.dataSource.paginator = this.paginator;
			this.isLoading = false
		})
		
	}

	editUser( userID:string, userEmail:string, userStatus:string ) {

		var data = {
			id: userID,
			email: userEmail,
			status: userStatus
		}

		const dialogRef = this.dialog.open(UserEditDialog, {
			width: '50em',
			data: data
		});

		dialogRef.afterClosed().subscribe(result => {
			this.authService.getAllUsers();
			this.usersSub = this.authService.getUsersUpdatedListener().subscribe( data => {
				this.users = data.users;
				this.dataSource = new MatTableDataSource(this.users);
				this.dataSource.sort = this.sort;
				this.dataSource.paginator = this.paginator;
			})
		});
	}
/*
	onDelete(volID: string, fName: string, lName: string) {

		let snackBarRef = this._snackBar.open("Are you sure you want to delete " + fName + " " + lName + " as a volunteer?", "Yes", {
			duration: 5000,
			panelClass: ['warn-snackbar']	// style for this can be found in src/style.css
		})

		snackBarRef.onAction().subscribe( () => {
			this.isLoading = true;
			this.volunteersService.deleteVolunteer(volID).subscribe( () => {		//execute when post gets deleted
				this.volunteersService.getAllVolunteers(); //		this.ordersPerPage, this.currentPage);
			}, () => {
				this.isLoading = false;
			});
		})

	}*/

	ngOnDestroy () {
		this.usersSub.unsubscribe();
		//this.authStatusSub.unsubscribe();
	}

	applyFilter(filterEvent: Event) {
		let value:string = (filterEvent.target as HTMLInputElement).value;
		value = value.trim().toLowerCase(); // Datasource defaults to lowercase matches
		this.dataSource.filter = value;
	}
}


//------------------------------------------------------------
// edit user component

@Component ({
	selector: 'user-edit-dialog',
	templateUrl: 'user-edit-dialog.component.html',
	styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialog implements OnInit{

	editUserFormGroup!: FormGroup;
	statuses = [
		'admin',
		'staff',
		'caller',
		'canvasser',
		'caller and canvasser',
		'unverified'
	]

	constructor(
		public dialogRef: MatDialogRef<UserEditDialog>,
		private authService: AuthService,
		@Inject(MAT_DIALOG_DATA) public data: {id:string, email:string, status:string}
	) {}

	ngOnInit() {

		this.editUserFormGroup = new FormGroup({
			'email': new FormControl(this.data.email, {
				validators: [Validators.required]
			}),
			'status': new FormControl(this.data.status)
		});
	}

	onEditUser() {
		this.authService.editUser(this.data.id, this.editUserFormGroup.value.email, this.editUserFormGroup.value.status)
	}

	onNoClick(): void {
		this.dialogRef.close();
	}

}