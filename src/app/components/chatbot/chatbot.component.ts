// chatbot.component.ts
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { ChatbotService } from '../../services/chatbot-service.service';
import { Message } from '../../interfaces/message';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    ButtonModule,
    RouterLink,
    InputTextModule,
    FormsModule,
    CardModule,
    AvatarModule,
    CommonModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent implements OnInit {
  messages: Message[] = [];
  newMessage: string = '';
  loading: boolean = false;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Ajouter un message d'accueil
    this.messages.push({
      text: 'Bonjour ! Je suis Formito, votre assistant de formation et d\'orientation professionnelle. Comment puis-je vous aider aujourd\'hui ?',
      sender: 'bot',
      timestamp: new Date()
    });
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
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
        this.messages.push({
          text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          sender: 'bot',
          timestamp: new Date()
        });
        this.loading = false;
      }
    });
  }
}
