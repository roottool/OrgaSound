import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firerbase from 'firebase/app';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private authState: any;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase,
    private router: Router
  ) {
    this.user = afAuth.authState;
  }

  authUser() {
    return this.user;
  }

  get currentUserId(): string {
    return this.authState !== null ? this.authState.uid : '';
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
    .then((user) => {
      const status = 'online';
      this.setUserStatus(user, status);
      this.router.navigate(['chat']);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['login']);
  }

  signUp(email: string, password: string, displayName: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then((createdUser) => {
        this.authState = this.user;
        const status = 'online';
        this.setUserData(createdUser, displayName, status);
      })
      .catch(error => console.log(error));
  }

  setUserData(createdUser: firerbase.auth.UserCredential, displayName: string, status: string): void {
    const path = `users/${createdUser.user.uid}`;
    const data = {
      email: createdUser.user.email,
      username: displayName,
      status: status
    };

    this.db.object(path).set(data)
      .catch(error => console.log(error));
  }

  setUserStatus(loginUser: firerbase.auth.UserCredential, status: string): void {
    const path = `users/${loginUser.user.uid}`;
    const data = {
      status: status
    };
  }
}
