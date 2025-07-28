import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../chatbot/chatbot.component';

@Component({
  selector: 'app-course-search',
  imports: [CommonModule, RouterModule, FormsModule, ChatbotComponent],
  templateUrl: './recherche.component.html',
  styleUrl: './recherche.component.scss',
})
export class RechercheComponent {
  searchQuery = '';
  selectedCategory = '';
  selectedLevel = '';
  selectedPrice = '';

  categories = [
    'Tous les domaines',
    'Développement Web',
    'Design',
    'Marketing',
    'Business',
    'Photographie',
    'Musique',
  ];

  levels = ['Tous niveaux', 'Débutant', 'Intermédiaire', 'Avancé'];

  priceRanges = ['Tous les prix', 'Gratuit', '0-50€', '50-100€', '100€+'];

  courses = [
    {
      id: 1,
      title: 'Complete Web Development Course',
      instructor: 'John Smith',
      price: 49.99,
      originalPrice: 99.99,
      rating: 4.8,
      reviews: 1234,
      students: 15000,
      image: 'pictures/course-1.png',
      level: 'Débutant',
      category: 'Développement Web',
      duration: '12 heures',
    },
    {
      id: 2,
      title: 'Advanced JavaScript Masterclass',
      instructor: 'Sarah Johnson',
      price: 69.99,
      originalPrice: 129.99,
      rating: 4.9,
      reviews: 2156,
      students: 8500,
      image: 'pictures/course-2.png',
      level: 'Avancé',
      category: 'Développement Web',
      duration: '18 heures',
    },
    {
      id: 3,
      title: 'UI/UX Design Fundamentals',
      instructor: 'Mike Wilson',
      price: 39.99,
      originalPrice: 79.99,
      rating: 4.7,
      reviews: 987,
      students: 12000,
      image: 'pictures/course-33.png',
      level: 'Débutant',
      category: 'Design',
      duration: '10 heures',
    },
    {
      id: 4,
      title: 'Digital Marketing Strategy',
      instructor: 'Emma Davis',
      price: 59.99,
      originalPrice: 119.99,
      rating: 4.6,
      reviews: 1543,
      students: 9800,
      image: 'pictures/course-1.png',
      level: 'Intermédiaire',
      category: 'Marketing',
      duration: '14 heures',
    },
    {
      id: 5,
      title: 'React Native Mobile Development',
      instructor: 'David Lee',
      price: 79.99,
      originalPrice: 149.99,
      rating: 4.8,
      reviews: 876,
      students: 6500,
      image: 'pictures/course-2.png',
      level: 'Avancé',
      category: 'Développement Web',
      duration: '20 heures',
    },
    {
      id: 6,
      title: 'Photography Basics',
      instructor: 'Lisa Brown',
      price: 29.99,
      originalPrice: 59.99,
      rating: 4.5,
      reviews: 654,
      students: 4200,
      image: 'pictures/course-33.png',
      level: 'Débutant',
      category: 'Photographie',
      duration: '8 heures',
    },
    {
      id: 7,
      title: 'Business Analytics with Excel',
      instructor: 'Robert Taylor',
      price: 44.99,
      originalPrice: 89.99,
      rating: 4.4,
      reviews: 1098,
      students: 7800,
      image: 'pictures/course-1.png',
      level: 'Intermédiaire',
      category: 'Business',
      duration: '12 heures',
    },
    {
      id: 8,
      title: 'Music Production Masterclass',
      instructor: 'Alex Martinez',
      price: 89.99,
      originalPrice: 179.99,
      rating: 4.9,
      reviews: 432,
      students: 3100,
      image: 'pictures/course-2.png',
      level: 'Avancé',
      category: 'Musique',
      duration: '25 heures',
    },
  ];

  filteredCourses = [...this.courses];

  onSearch() {
    this.filteredCourses = this.courses.filter((course) => {
      const matchesSearch =
        !this.searchQuery ||
        course.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        course.instructor
          .toLowerCase()
          .includes(this.searchQuery.toLowerCase());

      const matchesCategory =
        !this.selectedCategory ||
        this.selectedCategory === 'Tous les domaines' ||
        course.category === this.selectedCategory;

      const matchesLevel =
        !this.selectedLevel ||
        this.selectedLevel === 'Tous niveaux' ||
        course.level === this.selectedLevel;

      const matchesPrice =
        !this.selectedPrice ||
        this.selectedPrice === 'Tous les prix' ||
        this.checkPriceRange(course.price, this.selectedPrice);

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice;
    });
  }

  private checkPriceRange(price: number, range: string): boolean {
    switch (range) {
      case 'Gratuit':
        return price === 0;
      case '0-50€':
        return price >= 0 && price <= 50;
      case '50-100€':
        return price > 50 && price <= 100;
      case '100€+':
        return price > 100;
      default:
        return true;
    }
  }

  generateStars(rating: number): string[] {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('full');
    }

    if (hasHalfStar) {
      stars.push('half');
    }

    while (stars.length < 5) {
      stars.push('empty');
    }

    return stars;
  }
}
