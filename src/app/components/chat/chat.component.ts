import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ChatMessage} from "../../models/chat-message";
import {ActivatedRoute} from "@angular/router";
import {ApiBackendService} from "../../services/api.backend.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit{

  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  messageInput: string = '';
  userId: string="";
  messageList: any[] = [];
  datosPersona: any;
  contactsList: any[] = [];
  selectedContact: any = null;
  datosSala:any;
  mensajesBD: any[] = [];

  private messageSubscription: Subscription | null = null; // Para manejar la suscripción actual


  constructor(private  chatService: ChatService,
              private route: ActivatedRoute,
              private apiBackendService: ApiBackendService) {
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params["userId"];
    //this.chatService.initConnenctionSocket();
    // validar celular
    this.apiBackendService.validarCelular(this.userId).subscribe(
      (response) =>{
        if (response != null) {
          this.datosPersona = response;

          this.apiBackendService.obtenerContactos(this.datosPersona.id).subscribe(
            (responseContactos) =>{
              if (responseContactos != null) {
                this.contactsList = responseContactos;
                console.log(this.contactsList);
              } else {
                alert("NO EXISTEN CONTACTOS");
              }
            },
            (error) => {
            }
          );


        } else {
          alert("NO EXISTE CELULAR");
        }
      },
      (error) => {
      }
    );


  }

  sendMessage() {

    const chatMessage = {
      message: this.messageInput,
      user: this.userId,
      salaId: this.datosSala.idsala
    }as ChatMessage
    this.chatService.sendMessage(this.datosSala.idsala, chatMessage);
    this.messageInput = '';
  }

  lisenerMessage() {
    // Cancelar la suscripción anterior si existe
    if (this.messageSubscription) {
      console.error("ENTROOO");
      this.messageSubscription.unsubscribe();
      this.messageSubscription = null;
    }

    // Suscribirse a los nuevos mensajes
    this.messageSubscription = this.chatService.getMessageSubject().subscribe((messages: any) => {
      const newMessages = messages
        .filter((item: any) => item.salaId === this.datosSala.idsala)
        .map((item: any) => ({
        ...item,
        message_side: item.user === this.userId ? 'sender' : 'receiver'
      }));

      // Agregar los nuevos mensajes a la lista actual
      this.messageList = [...this.mensajesBD, ...newMessages];
      console.log(this.messageList);
    });
  }

  selectContact(contact: any) {
    this.selectedContact = contact;
    this.chatService.resetMessages();
    this.messageList = [];
    this.apiBackendService.obtenerSala(this.datosPersona.celular, this.selectedContact.celular).subscribe(
      (response) =>{
        this.datosSala = response;
        this.apiBackendService.obtenerChat(this.datosSala.idsala, this.datosPersona.celular).subscribe(
          (responseChat) =>{
            // Agregamos los mensajes de la API a `messageList`
            this.mensajesBD = responseChat;

            // Ahora escuchamos los nuevos mensajes desde los sockets
            this.initSocketConnectionAndJoinRoom(this.datosSala.idsala);
          },
          (error) => {
          }
        );
      },
      (error) => {
      }
    );

  }

  initSocketConnectionAndJoinRoom(roomId: string) {
    this.chatService.initConnenctionSocket();
    this.chatService.joinRoom(roomId);
    this.lisenerMessage();
  }

  scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Error scrolling to bottom:', err);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }


}
