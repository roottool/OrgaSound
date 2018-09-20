import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { resolve } from 'q';

@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {
  email: string;
  password: string;
  displayName: string;
  errorMsg: string;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  signUp() {
    const email = this.email;
    const password = this.password;
    const displayName = this.displayName;

    this.authService.signUp(email, password, displayName)
      .then(resolve => this.router.navigate(['chat']))
      .catch(error => this.errorMsg = error.message);
  }
}
