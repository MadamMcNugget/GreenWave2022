import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  isLoading = false;
	private authStatusSub: Subscription = new Subscription;

	constructor(public authService: AuthService) {}

	ngOnInit() {

		this.authStatusSub = this.authService.getUserAuthListener().subscribe( (authStatus) => {
			this.isLoading = false;
		});
	}

	ngOnDestroy() {
		this.authStatusSub.unsubscribe();
	}

	onSignup(form: NgForm) {
		if (form.invalid) {
			return;
		}

		this.isLoading = true;
		this.authService.createCustomer(form.value.email, form.value.password);
	}

}
