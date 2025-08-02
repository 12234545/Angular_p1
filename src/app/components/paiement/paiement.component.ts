import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { ChatbotComponent } from '../chatbot/chatbot.component';



interface PaymentForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
  email: string;
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
}

@Component({
  selector: 'app-paiement',
  standalone: true,
  imports: [CommonModule, FormsModule,NavbarComponent, ChatbotComponent],
  templateUrl: './paiement.component.html',
  styleUrls: ['./paiement.component.scss']
})
export class PaiementComponent implements OnInit {

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
    }
  };

  selectedMethod: 'card' | 'paypal' = 'card';
  acceptTerms: boolean = false;
  isProcessing: boolean = false;

  paymentForm: PaymentForm = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  ngOnInit(): void {
    // Récupérer les informations du cours depuis les paramètres de route ou un service
    this.loadCourseData();
  }

  loadCourseData(): void {
    // Dans un vrai projet, vous récupéreriez les données depuis un service
    // basé sur l'ID du cours passé en paramètre
    const courseId = this.route.snapshot.params['id'];
    if (courseId) {
      // Simuler le chargement des données du cours
      console.log('Chargement du cours avec ID:', courseId);
    }
  }

  selectMethod(method: 'card' | 'paypal'): void {
    this.selectedMethod = method;
  }

  goBack(): void {
    this.location.back();
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let matches = value.match(/\d{4,16}/g);
    let match = matches && matches[0] || '';
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      this.paymentForm.cardNumber = parts.join(' ');
    } else {
      this.paymentForm.cardNumber = value;
    }
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    this.paymentForm.expiryDate = value;
  }

  validateForm(): boolean {
    const { cardNumber, expiryDate, cvv, cardName, email } = this.paymentForm;

    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      this.showError('Numéro de carte invalide');
      return false;
    }

    if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
      this.showError('Date d\'expiration invalide');
      return false;
    }

    if (!cvv || cvv.length < 3) {
      this.showError('CVV invalide');
      return false;
    }

    if (!cardName.trim()) {
      this.showError('Nom sur la carte requis');
      return false;
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      this.showError('Email invalide');
      return false;
    }

    if (!this.acceptTerms) {
      this.showError('Veuillez accepter les conditions d\'utilisation');
      return false;
    }

    return true;
  }

  showError(message: string): void {
    // Ici vous pourriez utiliser un service de notification ou un toast
    alert(message);
  }

  showSuccess(message: string): void {
    // Ici vous pourriez utiliser un service de notification ou un toast
    alert(message);
  }

  processPayment(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isProcessing = true;

    // Simuler le traitement du paiement
    setTimeout(() => {
      this.isProcessing = false;

      // Simuler le succès du paiement
      const success = Math.random() > 0.1; // 90% de chance de succès pour la démo

      if (success) {
        this.showSuccess('Paiement effectué avec succès !');
        // Rediriger vers la page de formation
        this.router.navigate(['/formation', this.course.id]);
      } else {
        this.showError('Erreur lors du paiement. Veuillez réessayer.');
      }
    }, 3000);
  }

  processPayPalPayment(): void {
    // Simuler la redirection vers PayPal
    this.showSuccess('Redirection vers PayPal...');

    // Dans un vrai projet, vous redirigeriez vers PayPal
    setTimeout(() => {
      // Simuler le retour de PayPal avec succès
      this.router.navigate(['/formation', this.course.id]);
    }, 2000);
  }

  // Méthodes utilitaires pour le formatage
  onCardNumberInput(event: any): void {
    this.formatCardNumber(event);
  }

  onExpiryDateInput(event: any): void {
    this.formatExpiryDate(event);
  }

  onCvvInput(event: any): void {
    // Limiter à 4 chiffres max
    let value = event.target.value.replace(/\D/g, '');
    this.paymentForm.cvv = value.substring(0, 4);
  }
}
