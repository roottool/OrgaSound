import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireStorage } from 'angularfire2/storage';
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
  audio = new Audio();
  volumeElement: HTMLInputElement = <HTMLInputElement>document.getElementById('volume');

  constructor(
    private db: AngularFireDatabase,
    private afAuth: AngularFireAuth,
    private afStorage: AngularFireStorage
  ) {
    this.afAuth.authState.subscribe(auth => {
      if (auth !== undefined && auth !== null) {
        this.user = auth;
      }

      this.getUser().subscribe(currentUser => {
        this.userName = currentUser['username'];
      });
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

    // this.playSound(msg);
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

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  playSound(text: string) {
    const re = /^orga[0-9]*$/;

    if (re.test(text)) {
      // Create a reference to the file we want to download
      const itemRef = this.afStorage.storage.ref('orga/' + text + '.ogg');

      // Get the download URL
      itemRef.getDownloadURL().then((url) => {
        this.audio.pause();
        this.audio.currentTime = 0;
        const volume = Number(this.volumeElement.value) !== NaN ? Number(this.volumeElement.value) : 0.5;
        this.audio.volume = volume;
        this.audio.src = url;
        this.audio.play();
      }).catch((error) => {
        this.outputError(error);
      });
    } else {
      // Create a reference to the file we want to download
      const itemRef = this.afStorage.storage.ref('sound/' + text + '.ogg');

      // Get the download URL
      itemRef.getDownloadURL().then((url) => {
        const sound = new Audio(url);
        const volume = Number(this.volumeElement.value) !== NaN ? Number(this.volumeElement.value) : 0.5;
        sound.volume = volume;
        sound.play();
      }).catch((error) => {
        this.outputError(error);
      });
    }
  }

  outputError(error) {
    // A full list of error codes is available at
    // https://firebase.google.com/docs/storage/web/handle-errors
    switch (error.code) {
      case 'storage/object-not-found':
        // File doesn't exist
        console.log('Object not found');
        break;
      case 'storage/unauthorized':
        // User doesn't have permission to access the object
        console.log('Permission denied');
        break;
      case 'storage/canceled':
        // User canceled the upload
        console.log('Canceled upload');
        break;
      case 'storage/unknown':
        // Unknown error occurred, inspect the server response
        console.log('Unknown error');
        break;
    }
  }
}
