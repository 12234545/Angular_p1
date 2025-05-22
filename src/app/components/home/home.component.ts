import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-home',
  imports: [ NgFor , RouterLink , ChatbotComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  title = 'CLICK2LEARN';

  courses = [
    {
      id: 1,
      title: 'React - Fondamentaux et Applications Modernes',
      description: 'Maîtrisez le framework JavaScript le plus populaire pour créer des interfaces utilisateur dynamiques et réactives.',
      image: 'pictures/course-1.png',
      level: 'Niveau 1',
      instructor: {
        name: 'Othman',
        image: 'pictures/M1.jpg'
      },
      originalPrice: '$100',
      discountPrice: '$80'
    },
    {
      id: 2,
      title: 'Angular - Développement Front-End Avancé',
      description: 'Apprenez à créer des applications web complètes avec Angular, TypeScript et RxJS pour des projets professionnels.',
      image: 'pictures/course-2.png',
      level: 'Niveau 2',
      instructor: {
        name: 'Sarah',
        image: 'pictures/W1.JPG'
      },
      originalPrice: '$120',
      discountPrice: '$95'
    },
    {
      id: 3,
      title: 'Python - Data Science et Machine Learning',
      description: 'Découvrez comment exploiter la puissance de Python pour l\'analyse de données, la visualisation et l\'apprentissage automatique.',
      image: 'pictures/course-3.png',
      level: 'Niveau 3',
      instructor: {
        name: 'Mohammed',
        image: 'pictures/M1.jpg'
      },
      originalPrice: '$150',
      discountPrice: '$110'
    }
  ];


}
