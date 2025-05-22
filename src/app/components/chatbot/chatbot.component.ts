// floating-chatbot.component.ts
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
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
  showHelpMessage = true; // Propriété pour afficher/masquer le message d'aide
  @ViewChild('messagesContainer') messagesContainer: ElementRef | undefined;

  constructor(
    private chatbotService: ChatbotService,
    private router: Router
  ) {}

  ngOnInit() {
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

  toggleChat() {
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

  toggleExpand() {
    this.isExpanded = !this.isExpanded;
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  openFullChatbot() {
  // Stocker temporairement les messages actuels avant de naviguer
  if (this.messages.length > 0) {
    localStorage.setItem('temp-chatbot-messages', JSON.stringify(this.messages));
  }
  this.router.navigate(['/full-chatbot']);
}

  sendMessage() {
    if (!this.newMessage.trim()) return;

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

    // Envoi de la requête à l'API
    this.chatbotService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        // Ajouter la réponse du bot
        this.messages.push({
          text: response.response,
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
        this.messages.push({
          text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          sender: 'bot',
          timestamp: new Date()
        });
        this.loading = false;
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
}

