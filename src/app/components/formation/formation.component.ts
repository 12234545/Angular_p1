import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatbotComponent } from '../chatbot/chatbot.component';
import { NavbarComponent } from "../navbar/navbar.component";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: 'video' | 'text' | 'quiz';
}

interface CourseModule {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  lessons: Lesson[];
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
}

@Component({
  selector: 'app-formation',
  standalone: true,
  imports: [CommonModule, ChatbotComponent, NavbarComponent],
  templateUrl: './formation.component.html',
  styleUrls: ['./formation.component.scss']
})
export class FormationComponent implements OnInit {

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
        title: 'Introduction à React',
        duration: '2h 30min',
        completed: true,
        lessons: [
          { id: 1, title: 'Bienvenue dans la formation', duration: '5min', completed: true, type: 'video' },
          { id: 2, title: 'Qu\'est-ce que React?', duration: '10min', completed: true, type: 'video' },
          { id: 3, title: 'Configuration de l\'environnement', duration: '15min', completed: true, type: 'text' },
          { id: 4, title: 'Quiz : Concepts de base', duration: '5min', completed: false, type: 'quiz' }
        ]
      },
      {
        id: 2,
        title: 'Les fondamentaux JavaScript',
        duration: '3h 15min',
        completed: false,
        lessons: [
          { id: 5, title: 'Variables et types de données', duration: '20min', completed: false, type: 'video' },
          { id: 6, title: 'Fonctions et portée', duration: '25min', completed: false, type: 'video' },
          { id: 7, title: 'Objets et tableaux', duration: '30min', completed: false, type: 'text' },
          { id: 8, title: 'ES6+ Features', duration: '35min', completed: false, type: 'video' },
          { id: 9, title: 'Quiz : JavaScript moderne', duration: '10min', completed: false, type: 'quiz' }
        ]
      },
      {
        id: 3,
        title: 'Créer votre premier composant React',
        duration: '4h 20min',
        completed: false,
        lessons: [
          { id: 10, title: 'JSX et la syntaxe React', duration: '45min', completed: false, type: 'video' },
          { id: 11, title: 'Composants fonctionnels', duration: '60min', completed: false, type: 'video' },
          { id: 12, title: 'Props et communication', duration: '35min', completed: false, type: 'text' },
          { id: 13, title: 'Gestion des événements', duration: '40min', completed: false, type: 'video' },
          { id: 14, title: 'Projet pratique', duration: '80min', completed: false, type: 'text' },
          { id: 15, title: 'Quiz : Composants React', duration: '15min', completed: false, type: 'quiz' }
        ]
      },
      {
        id: 4,
        title: 'State et Hooks',
        duration: '5h 10min',
        completed: false,
        lessons: [
          { id: 16, title: 'Introduction au State', duration: '30min', completed: false, type: 'video' },
          { id: 17, title: 'useState Hook', duration: '45min', completed: false, type: 'video' },
          { id: 18, title: 'useEffect Hook', duration: '60min', completed: false, type: 'video' },
          { id: 19, title: 'Hooks personnalisés', duration: '40min', completed: false, type: 'text' },
          { id: 20, title: 'useContext Hook', duration: '50min', completed: false, type: 'video' },
          { id: 21, title: 'Projet : Application Todo', duration: '120min', completed: false, type: 'text' },
          { id: 22, title: 'Quiz : Hooks React', duration: '15min', completed: false, type: 'quiz' }
        ]
      }
    ]
  };

  currentLesson: Lesson | null = null;
  currentModule: number = 0;
  expandedModules: boolean[] = [];
  progress: number = 0;
  circumference: number = 2 * Math.PI * 26; // Rayon de 26 pour le cercle de progression

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
    this.calculateProgress();
    this.loadCourseFromRoute();
  }

  initializeComponent(): void {
    // Initialiser les modules expandus (fermer tous par défaut)
    this.expandedModules = new Array(this.course.modules.length).fill(false);

    // Ouvrir le premier module par défaut
    if (this.course.modules.length > 0) {
      this.expandedModules[0] = true;
    }
  }

  loadCourseFromRoute(): void {
    const courseId = this.route.snapshot.params['id'];
    if (courseId) {
      // Dans un vrai projet, vous chargeriez les données depuis un service
      console.log('Chargement de la formation avec ID:', courseId);
    }
  }

  calculateProgress(): void {
    const allLessons = this.getAllLessons();
    const completedLessons = allLessons.filter(lesson => lesson.completed);
    this.progress = Math.round((completedLessons.length / allLessons.length) * 100);
  }

  getAllLessons(): Lesson[] {
    return this.course.modules.flatMap(module => module.lessons);
  }

  getTotalLessons(): number {
    return this.getAllLessons().length;
  }

  toggleModule(moduleIndex: number): void {
    this.expandedModules[moduleIndex] = !this.expandedModules[moduleIndex];
    this.currentModule = moduleIndex;
  }

  selectLesson(lesson: Lesson): void {
    this.currentLesson = lesson;

    // Marquer la leçon comme en cours dans l'interface
    // et éventuellement la marquer comme visitée
  }

  startFirstLesson(): void {
    const firstLesson = this.course.modules[0]?.lessons[0];
    if (firstLesson) {
      this.selectLesson(firstLesson);
      this.expandedModules[0] = true;
      this.currentModule = 0;
    }
  }

  getLessonTypeLabel(type: string): string {
    switch (type) {
      case 'video':
        return 'Vidéo';
      case 'text':
        return 'Lecture';
      case 'quiz':
        return 'Quiz';
      default:
        return 'Contenu';
    }
  }

  markLessonCompleted(lesson: Lesson): void {
    lesson.completed = true;
    this.updateModuleCompletion();
    this.calculateProgress();

    // Dans un vrai projet, vous enverriez cette information au serveur
    console.log('Leçon marquée comme terminée:', lesson.title);
  }

  updateModuleCompletion(): void {
    this.course.modules.forEach(module => {
      const allCompleted = module.lessons.every(lesson => lesson.completed);
      module.completed = allCompleted;
    });
  }

  getCurrentLessonIndex(): number {
    if (!this.currentLesson) return -1;

    const allLessons = this.getAllLessons();
    return allLessons.findIndex(lesson => lesson.id === this.currentLesson!.id);
  }

  hasPreviousLesson(): boolean {
    return this.getCurrentLessonIndex() > 0;
  }

  hasNextLesson(): boolean {
    const currentIndex = this.getCurrentLessonIndex();
    const allLessons = this.getAllLessons();
    return currentIndex >= 0 && currentIndex < allLessons.length - 1;
  }

  goToPreviousLesson(): void {
    if (!this.hasPreviousLesson()) return;

    const allLessons = this.getAllLessons();
    const currentIndex = this.getCurrentLessonIndex();
    const previousLesson = allLessons[currentIndex - 1];

    if (previousLesson) {
      this.selectLesson(previousLesson);
      this.ensureLessonModuleExpanded(previousLesson);
    }
  }

  goToNextLesson(): void {
    if (!this.hasNextLesson()) return;

    const allLessons = this.getAllLessons();
    const currentIndex = this.getCurrentLessonIndex();
    const nextLesson = allLessons[currentIndex + 1];

    if (nextLesson) {
      // Marquer la leçon actuelle comme terminée
      if (this.currentLesson) {
        this.markLessonCompleted(this.currentLesson);
      }

      this.selectLesson(nextLesson);
      this.ensureLessonModuleExpanded(nextLesson);
    }
  }

  ensureLessonModuleExpanded(lesson: Lesson): void {
    // Trouver le module qui contient cette leçon et l'ouvrir
    for (let i = 0; i < this.course.modules.length; i++) {
      const module = this.course.modules[i];
      if (module.lessons.some(l => l.id === lesson.id)) {
        this.expandedModules[i] = true;
        this.currentModule = i;
        break;
      }
    }
  }

  getModuleProgress(module: CourseModule): number {
    const completedLessons = module.lessons.filter(lesson => lesson.completed).length;
    return Math.round((completedLessons / module.lessons.length) * 100);
  }

  // Méthodes utilitaires pour l'interface
  isLessonCurrent(lesson: Lesson): boolean {
    return this.currentLesson?.id === lesson.id;
  }

  isModuleExpanded(moduleIndex: number): boolean {
    return this.expandedModules[moduleIndex];
  }

  // Navigation et actions
  goToCourse(): void {
    this.router.navigate(['/cours', this.course.id]);
  }

  downloadCertificate(): void {
    if (this.progress === 100) {
      // Logique pour télécharger le certificat
      console.log('Téléchargement du certificat...');
    }
  }
}
