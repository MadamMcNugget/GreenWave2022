import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Voter } from '../voter.model';
import { VotersService } from '../voters.service';

@Component({
  selector: 'app-voters-view-all',
  templateUrl: './voters-view-all.component.html',
  styleUrls: ['./voters-view-all.component.css']
})
export class VotersViewAllComponent implements OnInit {

	isLoading = false;
	dataSource = new MatTableDataSource<Voter>();

  constructor(
		private votersService: VotersService
	) { }

  ngOnInit(): void {
  }

	getAllVoters(){

		this.isLoading = true;

		this.votersService.getAllVoters().subscribe( ( voters: Voter[] ) => {
			console.log( voters );
		})
	}

}
