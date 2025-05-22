// chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Message } from '../interfaces/message';
@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  private apiUrl = 'http://localhost:8000/api/chat'; // URL de votre API FastAPI

  constructor(private http: HttpClient) { }

  sendMessage(message: string, format: string = 'structured'): Observable<any> {
    return this.http.post<any>(this.apiUrl, {
      message: message,
      format: format
    });
  }



  // Méthode pour simuler la récupération des conversations (à remplacer par un appel API réel)
  getConversations(): Observable<any[]> {
    const savedConversations = localStorage.getItem('formito-conversations');
    if (savedConversations) {
      try {
        return of(JSON.parse(savedConversations));
      } catch (e) {
        console.error('Erreur lors du parsing des conversations:', e);
        return of([]);
      }
    }
    return of([]);
  }

  // Méthode pour simuler la sauvegarde d'une conversation (à remplacer par un appel API réel)
  saveConversation(conversation: any): Observable<boolean> {
    let conversations = [];
    const savedConversations = localStorage.getItem('formito-conversations');

    if (savedConversations) {
      try {
        conversations = JSON.parse(savedConversations);

        // Vérifier si la conversation existe déjà
        const index = conversations.findIndex((c: any) => c.id === conversation.id);
        if (index >= 0) {
          conversations[index] = conversation;
        } else {
          conversations.push(conversation);
        }
      } catch (e) {
        console.error('Erreur lors du parsing des conversations:', e);
        conversations = [conversation];
      }
    } else {
      conversations = [conversation];
    }

    localStorage.setItem('formito-conversations', JSON.stringify(conversations));
    return of(true);
  }

  // Méthode pour supprimer une conversation
  deleteConversation(conversationId: number): Observable<boolean> {
    const savedConversations = localStorage.getItem('formito-conversations');

    if (savedConversations) {
      try {
        const conversations = JSON.parse(savedConversations).filter(
          (c: any) => c.id !== conversationId
        );
        localStorage.setItem('formito-conversations', JSON.stringify(conversations));
      } catch (e) {
        console.error('Erreur lors de la suppression de la conversation:', e);
        return of(false);
      }
    }

    return of(true);
  }
}
