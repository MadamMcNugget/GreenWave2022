import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Voter } from './voter.model';

const BACKEND_URL = environment.apiUrl + '/voter/';

@Injectable({
  providedIn: 'root'
})
export class VotersService {

  constructor(
		private http: HttpClient
	) { }

	createVoter( voter: Voter ) {
		return this.http.post<{ success: boolean, message: string }>(BACKEND_URL, voter);
	}

	getAllVoters() {
		return this.http.get<{ voters: any[] }>( BACKEND_URL ).pipe( map( ( voterData ) => {
			return {
				voters: voterData.voters.map( voter => {
					return {
						...voter,
						id: voter._id
					}
				})
			}
		}))
	}

}
