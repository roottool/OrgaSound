import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';

import { PlayService } from '../services/play.service';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.scss']
})
export class SideNavbarComponent implements OnInit {
  user: Observable<firebase.User>;
  userName: string;
  slider: Object;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private db: AngularFireDatabase,
    private play: PlayService
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
    this.slider = this.play.volSlider;
  }

  logout() {
    this.authService.logout();
  }
}
