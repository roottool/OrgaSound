import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

import { ChatMessage } from '../models/chat-message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  user: firebase.User;
  chatMessages: AngularFireList<ChatMessage>;
  chatMessage: ChatMessage;
  userName: string;
  // volumeElement: HTMLInputElement = <HTMLInputElement>document.getElementById('volume');
  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }

      if (auth !== undefined && auth !== null) {
        this.getUser().subscribe(currentUser => {
          this.userName = currentUser['username'];
        });
      }
    });
  }

  getUser() {
    const userId = this.user.uid;
    const path = `users/${userId}`;
    return this.db.object(path).valueChanges();
  }

  getUsers() {
    const path = 'users';
    return this.db.list(path).valueChanges();
  }

  sendMessage(msg: string) {
    const timestamp = this.getTimeStamp();
    const email = this.user.email;

    this.chatMessages = this.getMessagesAngularFireList();
    this.chatMessages.push({
      message: msg,
      timeSent: timestamp,
      userName: this.userName,
      email: email
    });
  }

  getMessagesAngularFireList(): AngularFireList<ChatMessage> {
    // query to create our message feed binding
    return this.db.list('messages', ref => ref.orderByKey().limitToLast(25));
  }

  getMessagesObservable(): Observable<ChatMessage[]> {
    // query to create our message feed binding
    return this.db.list('messages', ref => ref.orderByKey().limitToLast(25)).valueChanges();
  }

  getLatestMessagesObservable(): Observable<ChatMessage[]> {
    // query to create our message feed binding
    return this.db.list('messages', ref => ref.orderByKey().limitToLast(1)).valueChanges();
  }

  getTimeStamp() {
    const now = Date.now(); /*
    const date = now.getUTCFullYear() + '/' +
      (now.getUTCMonth() + 1) + '/' +
      now.getUTCDate();
    const time = now.getUTCHours() + ':' +
      ('0' + now.getUTCMinutes()).slice(-2) + ':' +
      ('0' + now.getUTCSeconds()).slice(-2);*/

    return now.toString();
    // return (date + ' ' + time);
  }
}
