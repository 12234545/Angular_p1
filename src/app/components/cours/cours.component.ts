// cours.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { NavbarComponent } from "../navbar/navbar.component";

import { Router } from '@angular/router';

interface CourseModule {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'text' | 'quiz';
}

interface ForumPost {
  id: number;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
}

interface BlogPost {
  id: number;
  title: string;
  author: string;
  date: string;
  excerpt: string;
  readTime: string;
}

interface Poll {
  id: number;
  question: string;
  options: {option: string, votes: number}[];
  totalVotes: number;
  isActive: boolean;
}

interface Reference {
  id: number;
  title: string;
  type: 'pdf' | 'link' | 'video';
  url: string;
  description: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: 'low' | 'medium' | 'high';
}

interface Opportunity {
  id: number;
  title: string;
  company: string;
  type: 'job' | 'internship' | 'freelance';
  location: string;
  deadline: string;
}

interface Course {
  id: number;
  title: string;
  description: string;
  image: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  studentsCount: number;
  duration: string;
  level: string;
  instructor: {
    name: string;
    image: string;
    bio: string;
  };
  modules: CourseModule[];
  whatYouLearn: string[];
  requirements: string[];
  about: string;
}

@Component({
  selector: 'app-cours',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ChatbotComponent, NavbarComponent ],
  templateUrl: './cours.component.html',
  styleUrls: ['./cours.component.scss']
})
export class CoursComponent implements OnInit {
  course: Course = {
    id: 1,
    title: 'React de A à Z (Hooks, Redux, Contexte inclus)',
    description: 'Apprenez le framework JavaScript le plus populaire. Créez des applications web complètes.',
    image: 'pictures/course-1.png',
    price: 49.95,
    originalPrice: 99.99,
    discount: 50,
    rating: 4.8,
    studentsCount: 1234,
    duration: '40 heures',
    level: 'Débutant',
    instructor: {
      name: 'John Doe',
      image: 'pictures/M1.jpg',
      bio: 'Expert React avec 8 ans d\'expérience dans le développement web'
    },
    modules: [
      {
        id: 1,
        title: 'Introduction',
        duration: '2h 30min',
        completed: true,
        lessons: [
          { id: 1, title: 'Introduction', duration: '5min', completed: true, type: 'video' },
          { id: 2, title: 'Qu\'est-ce que React?', duration: '10min', completed: true, type: 'video' },
          { id: 3, title: 'Configuration de l\'environnement', duration: '15min', completed: true, type: 'video' }
        ]
      },
      {
        id: 2,
        title: 'Rappel JavaScript',
        duration: '3h 15min',
        completed: false,
        lessons: [
          { id: 4, title: 'Variables et types', duration: '20min', completed: false, type: 'video' },
          { id: 5, title: 'Fonctions et portée', duration: '25min', completed: false, type: 'video' },
          { id: 6, title: 'Objets et tableaux', duration: '30min', completed: false, type: 'video' }
        ]
      },
      {
        id: 3,
        title: 'Créer votre premier React',
        duration: '4h 20min',
        completed: false,
        lessons: [
          { id: 7, title: 'JSX et composants', duration: '45min', completed: false, type: 'video' },
          { id: 8, title: 'Props et state', duration: '60min', completed: false, type: 'video' },
          { id: 9, title: 'Gestion des événements', duration: '35min', completed: false, type: 'video' }
        ]
      }
    ],
    whatYouLearn: [
      'Bases fondamentales de React',
      'Utiliser les Context API',
      'Créer et gérer ses blogs React',
      'Créer des applications web modernes',
      'Maîtriser les Hooks React',
      'State et props',
      'Gérer l\'état avec Redux',
      'Tests unitaires avec Jest et React Testing Library',
      'Déploiement d\'applications React'
    ],
    requirements: [
      'Connaissances de base en HTML, CSS et JavaScript',
      'Un ordinateur avec un navigateur web moderne',
      'Motivation pour apprendre React'
    ],
    about: 'React est une bibliothèque JavaScript populaire pour construire des interfaces utilisateur interactives. Ce cours vous apprendra tout ce que vous devez savoir sur React, des concepts de base aux techniques avancées. Vous apprendrez à créer des composants réutilisables, à gérer l\'état de l\'application, et à construire des applications web modernes et performantes.'
  };

  activeTab: 'about' | 'content' | 'overview' | 'community' = 'about';
  communityTab: 'forum' | 'blog' | 'polls' | 'references' | 'announcements' | 'opportunities' = 'forum';
  expandedModules: Set<number> = new Set();

  // Données pour la communauté
  forumPosts: ForumPost[] = [
    { id: 1, title: 'Comment optimiser les performances React?', author: 'Marie Dubois', replies: 12, lastActivity: '2 heures', category: 'Questions' },
    { id: 2, title: 'Partage de projet: App de gestion de tâches', author: 'Pierre Martin', replies: 8, lastActivity: '1 jour', category: 'Projets' },
    { id: 3, title: 'Problème avec useEffect', author: 'Sophie Leroy', replies: 5, lastActivity: '3 heures', category: 'Aide' }
  ];

  blogPosts: BlogPost[] = [
    { id: 1, title: 'Les nouvelles fonctionnalités de React 18', author: 'John Doe', date: '2024-01-15', excerpt: 'Découvrez les améliorations apportées par React 18...', readTime: '5 min' },
    { id: 2, title: 'Bonnes pratiques pour les hooks', author: 'Jane Smith', date: '2024-01-10', excerpt: 'Apprenez à utiliser les hooks de manière optimale...', readTime: '8 min' }
  ];

  polls: Poll[] = [
    {
      id: 1,
      question: 'Quel framework préférez-vous avec React?',
      options: [
        { option: 'Next.js', votes: 45 },
        { option: 'Gatsby', votes: 20 },
        { option: 'Create React App', votes: 35 }
      ],
      totalVotes: 100,
      isActive: true
    }
  ];

  references: Reference[] = [
    { id: 1, title: 'Documentation officielle React', type: 'link', url: 'https://reactjs.org', description: 'Documentation complète de React' },
    { id: 2, title: 'Guide des hooks avancés', type: 'pdf', url: '/resources/hooks-guide.pdf', description: 'Guide détaillé des hooks React' },
    { id: 3, title: 'Tutoriel vidéo: État global', type: 'video', url: '/videos/global-state.mp4', description: 'Gestion de l\'état global avec Context API' }
  ];

  announcements: Announcement[] = [
    { id: 1, title: 'Nouvelle section sur les tests', content: 'Nous avons ajouté une nouvelle section dédiée aux tests unitaires.', date: '2024-01-20', priority: 'high' },
    { id: 2, title: 'Webinaire en direct le 25 janvier', content: 'Rejoignez-nous pour un webinaire sur les meilleures pratiques React.', date: '2024-01-18', priority: 'medium' }
  ];

  opportunities: Opportunity[] = [
    { id: 1, title: 'Développeur React Junior', company: 'Tech Solutions', type: 'job', location: 'Paris', deadline: '2024-02-15' },
    { id: 2, title: 'Stage développement Frontend', company: 'StartupX', type: 'internship', location: 'Lyon', deadline: '2024-02-20' }
  ];

  // Variables pour les formulaires
  newPost = { title: '', content: '', category: 'Questions' };
  newComment = '';
  selectedPoll = '';

  constructor(private route: ActivatedRoute,private router: Router) {}

  ngOnInit() {
    // Scroll vers le haut au chargement du composant
    window.scrollTo(0, 0);

    // Récupérer l'ID du cours depuis les paramètres de route
    this.route.params.subscribe(params => {
      const courseId = params['id'];
      if (courseId) {
        // Charger les données du cours spécifique
        this.loadCourse(courseId);
      }
    });
  }
  startCourse(): void {
  // Rediriger vers la page de paiement avec l'ID du cours
  this.router.navigate(['/paiement', this.course.id]);
}

  private loadCourse(courseId: string) {
    // Logique pour charger les données du cours spécifique
    // Pour l'instant, nous utilisons les données hardcodées
    console.log('Chargement du cours ID:', courseId);
  }

  setActiveTab(tab: 'about' | 'content' | 'overview' | 'community') {
    this.activeTab = tab;
  }

  setCommunityTab(tab: 'forum' | 'blog' | 'polls' | 'references' | 'announcements' | 'opportunities') {
    this.communityTab = tab;
  }

  toggleModule(moduleId: number) {
    if (this.expandedModules.has(moduleId)) {
      this.expandedModules.delete(moduleId);
    } else {
      this.expandedModules.add(moduleId);
    }
  }

  isModuleExpanded(moduleId: number): boolean {
    return this.expandedModules.has(moduleId);
  }

  getCompletionPercentage(): number {
    const totalLessons = this.course.modules.reduce((total, module) => total + module.lessons.length, 0);
    const completedLessons = this.course.modules.reduce((total, module) =>
      total + module.lessons.filter(lesson => lesson.completed).length, 0);
    return Math.round((completedLessons / totalLessons) * 100);
  }

  getLessonIcon(type: string): string {
    switch (type) {
      case 'video': return '▶️';
      case 'text': return '📄';
      case 'quiz': return '❓';
      default: return '📚';
    }
  }

  getTotalLessons(): number {
    return this.course.modules.reduce((total, module) => total + module.lessons.length, 0);
  }

  getTotalDuration(): string {
    // Pour cet exemple, on retourne une durée fixe
    // En pratique, vous calculeriez la durée totale à partir des modules
    return '40h 30min';
  }

  // Méthodes pour la communauté
  createForumPost() {
    if (this.newPost.title && this.newPost.content) {
      const post: ForumPost = {
        id: this.forumPosts.length + 1,
        title: this.newPost.title,
        author: 'Vous',
        replies: 0,
        lastActivity: 'Maintenant',
        category: this.newPost.category
      };
      this.forumPosts.unshift(post);
      this.newPost = { title: '', content: '', category: 'Questions' };
    }
  }

  voteInPoll(pollId: number, optionIndex: number) {
    const poll = this.polls.find(p => p.id === pollId);
    if (poll) {
      poll.options[optionIndex].votes++;
      poll.totalVotes++;
    }
  }

  getReferenceIcon(type: string): string {
    switch (type) {
      case 'pdf': return '📄';
      case 'link': return '🔗';
      case 'video': return '📹';
      default: return '📚';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🔵';
    }
  }

  getOpportunityIcon(type: string): string {
    switch (type) {
      case 'job': return '💼';
      case 'internship': return '🎓';
      case 'freelance': return '💻';
      default: return '🚀';
    }
  }
}
