import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  user: Observable<firebase.User>;
  userName: string;

  constructor(
    private authService: AuthService,
    private db: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.user = this.authService.authUser();
    this.user.subscribe(user => {
      if (user) {
        const path = `users/${user.uid}`;
        this.db.object(path).valueChanges().subscribe(currentUser => {
          this.userName = currentUser['username'];
        });
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}
