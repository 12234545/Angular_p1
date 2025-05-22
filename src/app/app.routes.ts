import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  loadComponent: () =>{
    return import('./components/home/home.component').then(m => m.HomeComponent);
  }
},

{
  path: 'login',
  loadComponent: () =>{
    return import('./components/login/login.component').then(m => m.LoginComponent);
  }
},
{
  path: 'register',
  loadComponent: () =>{
    return import('./components/register/register.component').then(m => m.RegisterComponent);
  }
},
{
  path: 'chatbot',
  loadComponent: () =>{
    return import('./components/chatbot/chatbot.component').then(m => m.ChatbotComponent);
  }
},

{
  path: 'full-chatbot',
  loadComponent: () =>{
    return import('./components/chatbot/full-chatbot/full-chatbot.component').then(m => m.FullChatbotComponent);
  }
}

];
