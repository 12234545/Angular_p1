import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';


@Component({
  selector: 'app-home',
  imports: [ NgFor , RouterLink , ChatbotComponent, CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})

export class HomeComponent {
    title = 'CLICK2LEARN';
  courses = [
    {
      id: 1,
      title: 'React de A à Z',
      description: 'Apprenez React depuis les bases jusqu\'aux concepts avancés',
      image: 'pictures/course-1.png',
      level: 'Débutant',
      originalPrice: '$99.99',
      discountPrice: '$49.99',
      instructor: {
        name: 'John Doe',
        image: 'pictures/M1.jpg'
      }
    },
    {
      id: 2,
      title: 'Angular Complete',
      description: 'Maîtrisez Angular et créez des applications robustes',
      image: 'pictures/course-2.png',
      level: 'Intermédiaire',
      originalPrice: '$89.99',
      discountPrice: '$39.99',
      instructor: {
        name: 'Jane Smith',
        image: 'pictures/M1.jpg'
      }
    },
    {
      id: 3,
      title: 'Vue.js Masterclass',
      description: 'Développez des interfaces utilisateur avec Vue.js',
      image: 'pictures/course-33.png',
      level: 'Débutant',
      originalPrice: '$79.99',
      discountPrice: '$29.99',
      instructor: {
        name: 'Mike Johnson',
        image: 'pictures/M1.jpg'
      }
    }
  ];

  // Injecter le Router dans le constructeur
  constructor(private router: Router) {}

  navigateToCourse(courseId: number) {
    // Navigation avec scroll vers le haut
    this.router.navigate(['/cours', courseId]).then(() => {
      // Scroll vers le haut après la navigation
      window.scrollTo(0, 0);
    });
  }
}
