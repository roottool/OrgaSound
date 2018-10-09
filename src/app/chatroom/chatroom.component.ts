import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { ChatService } from '../services/chat.service';
import * as firebase from 'firebase/app';
import { PlayService } from '../services/play.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.scss']
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller') private feedContainer: ElementRef;
  beforeFeedTime: string;
  completeInit = false;

  constructor(
    private chat: ChatService,
    private play: PlayService
  ) { }

  ngOnInit() {
    firebase.database().ref('messages').on('value', () => {
      this.chat.getLatestMessagesObservable()
      .subscribe(chatMessage => {
        const msg = chatMessage[0].message;
        if (this.completeInit) {
          if (msg === 'stop') {
            this.play.stop();
          } else {
            this.play.playSound(msg);
          }
        }
        this.completeInit = true;
      });
    });
  }

  scrollToBottom(): void {
    this.feedContainer.nativeElement.scrollTop = this.feedContainer.nativeElement.scrollHeight;
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
