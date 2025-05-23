// floating-chatbot.component.ts
import { Component, ViewChild, ElementRef, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ChatbotService } from '../../services/chatbot-service.service';
import { Message } from '../../interfaces/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-floating-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements OnInit {
  isOpen = false;
  isExpanded = false;
  messages: Message[] = [];
  newMessage = '';
  loading = false;
  showHelpMessage = true;
  apiConnected = false;
  @ViewChild('messagesContainer') messagesContainer: ElementRef | undefined;

  constructor(
    private chatbotService: ChatbotService,
    private router: Router
  ) {}

  ngOnInit() {
    // Test de connexion à l'API au démarrage
    this.testApiConnection();

    this.messages.push({
      text: 'Bonjour ! Je suis Formito, votre assistant de formation et d\'orientation professionnelle. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    });

    // Affiche le message d'aide pendant 10 secondes, puis le masque
    setTimeout(() => {
      this.showHelpMessage = false;
    }, 10000);
  }

  testApiConnection() {
    this.chatbotService.testConnection().subscribe({
      next: (response) => {
        if (response.status === 'healthy') {
          this.apiConnected = true;
          console.log('✅ Connexion API réussie');
        } else {
          this.apiConnected = false;
          console.warn('⚠️ API non disponible');
        }
      },
      error: (error) => {
        this.apiConnected = false;
        console.error('❌ Erreur de connexion API:', error);
      }
    });
  }

  // Écouter les clics sur le document pour fermer le chatbot si on clique en dehors
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    const chatbotContainer = target.closest('.floating-chatbot-container');

    // Si le clic n'est pas dans le conteneur du chatbot et que le chatbot est ouvert
    if (!chatbotContainer && this.isOpen) {
      // On peut optionnellement fermer le chatbot ici
      // this.isOpen = false;
      // this.isExpanded = false;
    }
  }

  toggleChat(event?: Event) {
    // Empêcher la propagation de l'événement
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Quand on clique sur le bouton, on masque le message d'aide
    this.showHelpMessage = false;
    this.isOpen = !this.isOpen;

    // Si on ferme le chat, on s'assure aussi de le réduire
    if (!this.isOpen) {
      this.isExpanded = false;
    }

    if (this.isOpen) {
      setTimeout(() => {
        this.scrollToBottom();
      }, 100);
    }
  }

  toggleExpand(event?: Event) {
    // Empêcher la propagation de l'événement
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    this.isExpanded = !this.isExpanded;
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  openFullChatbot(event?: Event) {
    // Empêcher la propagation de l'événement
    if (event) {
      event.stopPropagation();
      event.preventDefault();
    }

    // Stocker temporairement les messages actuels avant de naviguer
    if (this.messages.length > 0) {
      localStorage.setItem('temp-chatbot-messages', JSON.stringify(this.messages));
    }
    this.router.navigate(['/full-chatbot']);
  }

  sendMessage(event?: Event) {
    // Empêcher la propagation si c'est un événement de clic
    if (event) {
      event.stopPropagation();
    }

    if (!this.newMessage.trim()) return;

    // Vérifier la connexion API
    if (!this.apiConnected) {
      this.messages.push({
        text: 'Connexion au serveur en cours... Veuillez patienter.',
        sender: 'bot',
        timestamp: new Date()
      });
      this.testApiConnection();
      return;
    }

    // Ajouter le message de l'utilisateur
    this.messages.push({
      text: this.newMessage,
      sender: 'user',
      timestamp: new Date()
    });

    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.loading = true;

    setTimeout(() => {
      this.scrollToBottom();
    }, 10);

    // Envoi de la requête à l'API Colab via ngrok
    this.chatbotService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        // Ajouter la réponse du bot
        this.messages.push({
          text: response.response || 'Réponse reçue',
          sender: 'bot',
          timestamp: new Date()
        });
        this.loading = false;
        setTimeout(() => {
          this.scrollToBottom();
        }, 10);
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
        let errorMessage = 'Désolé, une erreur est survenue. ';

        if (error.status === 0) {
          errorMessage += 'Impossible de se connecter au serveur. Vérifiez que l\'URL ngrok est correcte.';
        } else if (error.status === 404) {
          errorMessage += 'Endpoint non trouvé. Vérifiez l\'URL de l\'API.';
        } else if (error.status === 500) {
          errorMessage += 'Erreur serveur. Vérifiez les logs Colab.';
        } else {
          errorMessage += 'Veuillez réessayer.';
        }

        this.messages.push({
          text: errorMessage,
          sender: 'bot',
          timestamp: new Date()
        });
        this.loading = false;
        this.apiConnected = false;
        setTimeout(() => {
          this.scrollToBottom();
        }, 10);
      }
    });
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    }
  }

  // Méthode pour empêcher la fermeture du chatbot quand on clique à l'intérieur
  onChatClick(event: Event) {
    event.stopPropagation();
  }
}
