// full-chatbot.component.ts
import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AvatarModule } from 'primeng/avatar';
import { ChatbotService } from '../../../services/chatbot-service.service';
import { Message } from '../../../interfaces/message';

interface Conversation {
  id: number;
  title: string;
  preview: string;
  messages: Message[];
  date: Date;
}

@Component({
  selector: 'app-full-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    AvatarModule,
    RouterModule
  ],
  templateUrl: './full-chatbot.component.html',
  styleUrls: ['./full-chatbot.component.scss']
})
export class FullChatbotComponent implements OnInit {
  conversations: Conversation[] = [];
  currentConversationIndex = 0;
  newMessage = '';
  loading = false;
  sidebarCollapsed = false;

  @ViewChild('messagesContainer') messagesContainer: ElementRef | undefined;

  constructor(private chatbotService: ChatbotService) {}

  ngOnInit() {
    // Charger les conversations depuis un service ou créer une nouvelle
    this.loadConversations();

    // Si aucune conversation n'existe, en créer une nouvelle
    if (this.conversations.length === 0) {
      this.startNewChat();
    }
  }

  get currentMessages(): Message[] {
    if (this.conversations.length === 0) return [];
    return this.conversations[this.currentConversationIndex].messages;
  }

  loadConversations() {
    // Ici, vous pourriez charger les conversations depuis localStorage ou une API
    // Pour l'exemple, nous allons simuler quelques conversations

    const savedConversations = localStorage.getItem('formito-conversations');

    if (savedConversations) {
      try {
        const parsedConvos = JSON.parse(savedConversations);
        // Convertir les dates string en objets Date
        this.conversations = parsedConvos.map((convo: any) => ({
          ...convo,
          date: new Date(convo.date)
        }));
      } catch (e) {
        console.error('Erreur lors du chargement des conversations:', e);
        this.createDefaultConversation();
      }
    } else {
      this.createDefaultConversation();
    }
  }

  createDefaultConversation() {
    // Créer une conversation par défaut
    this.conversations = [{
      id: Date.now(),
      title: 'Nouvelle conversation',
      preview: 'Bonjour ! Je suis Formito...',
      date: new Date(),
      messages: [{
        text: 'Bonjour ! Je suis Formito, votre assistant de formation et d\'orientation professionnelle. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot',
        timestamp: new Date()
      }]
    }];
    this.saveConversations();
  }

  saveConversations() {
    localStorage.setItem('formito-conversations', JSON.stringify(this.conversations));
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  startNewChat() {
    // Créer une nouvelle conversation
    const newConvo: Conversation = {
      id: Date.now(),
      title: 'Nouvelle conversation',
      preview: 'Bonjour ! Je suis Formito...',
      date: new Date(),
      messages: [{
        text: 'Bonjour ! Je suis Formito, votre assistant de formation et d\'orientation professionnelle. Comment puis-je vous aider aujourd\'hui ?',
        sender: 'bot',
        timestamp: new Date()
      }]
    };

    // Ajouter au début du tableau
    this.conversations.unshift(newConvo);
    this.currentConversationIndex = 0;

    // Sauvegarder les changements
    this.saveConversations();

    // Scroll vers le bas après le rendu
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  selectConversation(index: number) {
    this.currentConversationIndex = index;

    // Scroll vers le bas pour voir les derniers messages
    setTimeout(() => {
      this.scrollToBottom();
    }, 100);
  }

  clearChat() {
    if (confirm('Êtes-vous sûr de vouloir effacer cette conversation ?')) {
      this.startNewChat();
    }
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    // Récupérer la conversation courante
    const currentConvo = this.conversations[this.currentConversationIndex];

    // Ajouter le message de l'utilisateur
    currentConvo.messages.push({
      text: this.newMessage,
      sender: 'user',
      timestamp: new Date()
    });

    // Mettre à jour le titre et l'aperçu de la conversation
    if (currentConvo.title === 'Nouvelle conversation') {
      currentConvo.title = this.newMessage.length > 30
                          ? this.newMessage.substring(0, 27) + '...'
                          : this.newMessage;
    }
    currentConvo.preview = this.newMessage;
    currentConvo.date = new Date();

    const messageToSend = this.newMessage;
    this.newMessage = '';
    this.loading = true;

    // Sauvegarder les changements
    this.saveConversations();

    setTimeout(() => {
      this.scrollToBottom();
    }, 10);

    // Envoi de la requête à l'API
    this.chatbotService.sendMessage(messageToSend).subscribe({
      next: (response) => {
        // Ajouter la réponse du bot
        currentConvo.messages.push({
          text: response.response,
          sender: 'bot',
          timestamp: new Date()
        });

        // Mettre à jour l'aperçu avec la réponse du bot
        currentConvo.preview = response.response.length > 40
                             ? response.response.substring(0, 37) + '...'
                             : response.response;

        this.loading = false;

        // Sauvegarder les changements
        this.saveConversations();

        setTimeout(() => {
          this.scrollToBottom();
        }, 10);
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi du message:', error);
        currentConvo.messages.push({
          text: 'Désolé, une erreur est survenue. Veuillez réessayer.',
          sender: 'bot',
          timestamp: new Date()
        });
        this.loading = false;

        // Sauvegarder les changements
        this.saveConversations();

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
