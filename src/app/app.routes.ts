import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => {
      return import('./components/home/home.component').then(
        (m) => m.HomeComponent
      );
    },
  },

  {
    path: 'login',
    loadComponent: () => {
      return import('./components/login/login.component').then(
        (m) => m.LoginComponent
      );
    },
  },
  {
    path: 'register',
    loadComponent: () => {
      return import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      );
    },
  },
  {
    path: 'chatbot',
    loadComponent: () => {
      return import('./components/chatbot/chatbot.component').then(
        (m) => m.ChatbotComponent
      );
    },
  },

  {
    path: 'full-chatbot',
    loadComponent: () => {
      return import(
        './components/chatbot/full-chatbot/full-chatbot.component'
      ).then((m) => m.FullChatbotComponent);
    },
  },
  {
    path: 'cours',
    loadComponent: () => {
      return import('./components/recherche/recherche.component').then(
        (m) => m.RechercheComponent
      );
    },
  },
  {
    path: 'cours/:id',
    loadComponent: () => {
      return import('./components/cours/cours.component').then(
        (m) => m.CoursComponent
      );
    },
  },
  {
    path: 'etablissement',
    loadComponent: () => {
      return import('./components/etablissement/etablissement.component').then(
        (m) => m.EtablissementComponent
      );
    },
  },
  {
    path: 'apropos',
    loadComponent: () => {
      return import('./components/about-us/about-us.component').then(
        (m) => m.AboutUsComponent
      );
    },
  },
];
