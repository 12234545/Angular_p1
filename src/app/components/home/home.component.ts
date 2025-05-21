import { Component, signal } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [ NgFor , RouterLink ],
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

  // Mock data for categories
  categories = [
    { id: 1, name: 'UX/UI', imageUrl: 'assets/images/ux-ui.jpg' },
    { id: 2, name: 'React', imageUrl: 'assets/images/react.jpg' },
    { id: 3, name: 'PHP', imageUrl: 'assets/images/php.jpg' },
    { id: 4, name: 'JavaScript', imageUrl: 'assets/images/javascript.jpg' }
  ];

  // Mock data for institutions
  institutions = [
    { id: 1, name: 'Institution 1', logo: 'assets/images/institution-1.png' },
    { id: 2, name: 'Institution 2', logo: 'assets/images/institution-2.png' },
    { id: 3, name: 'Institution 3', logo: 'assets/images/institution-3.png' },
    { id: 4, name: 'Institution 4', logo: 'assets/images/institution-4.png' },
    { id: 5, name: 'Institution 5', logo: 'assets/images/institution-5.png' }
  ];

  // Mock data for partners
  partners = [
    { id: 1, name: 'MOOC', logo: 'assets/images/mooc.png' },
    { id: 2, name: 'Udemy', logo: 'assets/images/udemy.png' },
    { id: 3, name: 'Coursera', logo: 'assets/images/coursera.png' },
    { id: 4, name: 'edX', logo: 'assets/images/edx.png' }
  ];

  // Form handling methods
  subscribeToNewsletter(email: string) {
    console.log('Subscribing email:', email);
    // Add API call to subscribe
  }

  login(username: string, password: string) {
    console.log('Login attempt:', username);
    // Add authentication logic
  }

  register(email: string, username: string, password: string) {
    console.log('Registration attempt:', username, email);
    // Add registration logic
  }
}
