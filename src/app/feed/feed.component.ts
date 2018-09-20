import { Component, OnInit, OnChanges } from '@angular/core';
import { ChatService } from '../services/chat.service';
import { Observable } from 'rxjs';
import { ChatMessage } from '../models/chat-message.model';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss']
})
export class FeedComponent implements OnInit, OnChanges {
  feed: Observable<ChatMessage[]>;
  // feed: AngularFireList<ChatMessage>;

  constructor(
    private chat: ChatService
    // private chat: AngularFireDatabase
  ) { }

  ngOnInit() {
    // this.feed = this.chat.getMessages();
    this.feed = this.chat.getMessagesObservable();
  }

  ngOnChanges() {
    // this.feed = this.chat.getMessages();
    this.feed = this.chat.getMessagesObservable();
  }
}
