import { Injectable } from '@angular/core';
import {Stomp} from "@stomp/stompjs";
import * as SockJS from 'sockjs-client';
import { ChatMessage } from '../models/chat-message';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  public stompClient: any
  private messageSubject: BehaviorSubject<ChatMessage[]> = new BehaviorSubject<ChatMessage[]>([]);
  private rooms: string[] = [];

  constructor() {
    this.initConnenctionSocket()
  }

  initConnenctionSocket(){
    const url = '//chatappbackend-production-52f3.up.railway.app/chat-socket';
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket)
  }


  joinRoom(roomId: string) {

    this.stompClient.connect({}, () => {
      if (!this.rooms.includes(roomId)) {
        console.log('si agregóooooo')
        this.rooms.push(roomId);
        this.stompClient.subscribe(`/topic/${roomId}`, (messages: any) => {
          const messageContent = JSON.parse(messages.body);
          const currentMessage = this.messageSubject.getValue();
          currentMessage.push(messageContent);

          this.messageSubject.next(currentMessage);
        })
      } else {
        console.log('no agregóoooooo')
      }

    })

  }

  sendMessage(roomId: string, chatMessage: ChatMessage) {
    this.stompClient.send(`/app/chat/${roomId}`, {}, JSON.stringify(chatMessage))
  }

  getMessageSubject(){
    return this.messageSubject.asObservable();
  }

  resetMessages() {
    this.messageSubject.next([]); // Limpia los mensajes emitidos
  }



}
