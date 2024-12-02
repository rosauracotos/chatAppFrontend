import { Component } from '@angular/core';
import {ChatService} from "../../services/chat.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ApiBackendService} from "../../services/api.backend.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  phoneNumber: string = '';
  errorMessage: string = '';

  constructor(private  chatService: ChatService,
              private route: ActivatedRoute,
              private router: Router,
              private apiBackendService: ApiBackendService) {
  }



  onSubmit(event: Event) {
    event.preventDefault();
    if (!this.phoneNumber) {
      this.errorMessage = 'Por favor, ingresa un número de celular.';
      return;
    }

    this.apiBackendService.validarCelular(this.phoneNumber).subscribe(
      (response) => {
        if (response) {
          // Redirigir al componente de chatz|
          this.router.navigate([`/chat/${this.phoneNumber}`]);
        } else {
          this.errorMessage = 'El número ingresado no está registrado.';
        }
      },
      (error) => {
        this.errorMessage = 'Error en el servidor. Intente nuevamente.';
      }
    );
  }

}
