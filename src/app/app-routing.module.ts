import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ChatComponent} from "./components/chat/chat.component";
import {LoginComponent} from "./components/login/login.component";

const routes: Routes = [
  { path: 'chat/:userId', component: ChatComponent},
  { path: 'login', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
