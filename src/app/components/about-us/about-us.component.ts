import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule, RouterModule , ChatbotComponent , NavbarComponent],
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent {

  teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Fondatrice',
      image: 'pictures/W1.JPG',
      description: 'Experte en éducation numérique avec 15 ans d\'expérience dans le développement de plateformes d\'apprentissage.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Marc Dubois',
      role: 'CTO',
      image: 'pictures/M1.jpg',
      description: 'Ingénieur logiciel passionné par l\'innovation technologique dans l\'éducation.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Emma Martin',
      role: 'Directrice Pédagogique',
      image: 'pictures/W2.jpeg',
      description: 'Spécialiste en pédagogie numérique et conception de parcours d\'apprentissage.',
      linkedin: '#',
      twitter: '#'
    },
    {
      name: 'Thomas Lopez',
      role: 'Lead Developer',
      image: 'pictures/M4.jpg',
      description: 'Développeur full-stack avec une expertise en Angular et technologies cloud.',
      linkedin: '#',
      twitter: '#'
    }
  ];

  values = [
    {
      icon: 'fas fa-lightbulb',
      title: 'Innovation',
      description: 'Nous repoussons constamment les limites de l\'apprentissage numérique avec des technologies de pointe.'
    },
    {
      icon: 'fas fa-users',
      title: 'Collaboration',
      description: 'Nous croyons en la puissance de la collaboration pour créer des expériences d\'apprentissage exceptionnelles.'
    },
    {
      icon: 'fas fa-star',
      title: 'Excellence',
      description: 'Nous nous efforçons d\'offrir la meilleure qualité dans tous nos services et produits.'
    },
    {
      icon: 'fas fa-heart',
      title: 'Passion',
      description: 'Notre passion pour l\'éducation guide chacune de nos décisions et innovations.'
    }
  ];

  stats = [
    { number: '500K+', label: 'Étudiants formés' },
    { number: '2K+', label: 'Formateurs actifs' },
    { number: '150+', label: 'Établissements partenaires' },
    { number: '98%', label: 'Taux de satisfaction' }
  ];

  constructor() { }

}
