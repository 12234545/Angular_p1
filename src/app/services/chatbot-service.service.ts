// chatbot.service.ts
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ChatbotService {

  private apiUrl = 'https://c9b8-34-87-98-166.ngrok-free.app/api/chat';
  private baseUrl = 'https://c9b8-34-87-98-166.ngrok-free.app';

  constructor(private http: HttpClient) {}

  updateApiUrl(newUrl: string) {
    if (!newUrl.startsWith('https://')) {
      newUrl = 'https://' + newUrl;
    }

    this.baseUrl = newUrl;
    this.apiUrl = newUrl + '/api/chat';

    console.log('URL API mise à jour:', this.apiUrl);
  }

  sendMessage(message: string, format: string = 'default'): Observable<any> {
    console.log('Envoi du message:', message);
    console.log('Vers URL:', this.apiUrl);

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true',
      Accept: 'application/json',
    });

    const requestBody = {
      message: message.trim(),
      format: format,
      user_id: 'angular_user',
    };

    console.log('Corps de la requête:', requestBody);

    return this.http
      .post<any>(this.apiUrl, requestBody, {
        headers,
        responseType: 'json',
      })
      .pipe(
        timeout(30000),
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur détaillée:', error);

          let errorMessage = 'Désolé, je ne peux pas répondre pour le moment.';

          if (error.status === 0) {
            errorMessage =
              "Impossible de se connecter au serveur. Vérifiez que l'URL ngrok est correcte et que Colab fonctionne.";
          } else if (error.status === 404) {
            errorMessage = "Endpoint non trouvé. Vérifiez l'URL de l'API.";
          } else if (error.status === 422) {
            errorMessage =
              'Erreur de validation des données. Vérifiez le format du message.';
          } else if (error.status === 500) {
            errorMessage = 'Erreur serveur. Vérifiez les logs dans Colab.';
          }

          return of({
            response: errorMessage,
            error: true,
            status: 'error',
            details: error.message,
          });
        })
      );
  }

  testConnection(): Observable<any> {
    const testUrl = this.baseUrl + '/api/health';
    console.log('Test de connexion vers:', testUrl);

    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      Accept: 'application/json',
    });

    return this.http.get<any>(testUrl, { headers }).pipe(
      timeout(10000),
      catchError((error: HttpErrorResponse) => {
        console.error('Erreur de connexion:', error);

        let errorDetails = 'Connexion impossible';
        if (error.status === 0) {
          errorDetails =
            "Serveur non accessible. Vérifiez l'URL ngrok et que Colab fonctionne.";
        }

        return of({
          status: 'error',
          message: errorDetails,
          details: error.message,
        });
      })
    );
  }

  getPlatformInfo(): Observable<any> {
    const infoUrl = this.baseUrl + '/api/platform-info';
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      Accept: 'application/json',
    });

    return this.http.get<any>(infoUrl, { headers }).pipe(
      timeout(10000),
      catchError((error) => {
        console.error('Erreur récupération info plateforme:', error);
        return of({});
      })
    );
  }

  isConfigured(): boolean {
    return this.apiUrl !== 'https://c9b8-34-87-98-166.ngrok-free.app/api/chat';
  }

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

  saveConversation(conversation: any): Observable<boolean> {
    let conversations = [];
    const savedConversations = localStorage.getItem('formito-conversations');

    if (savedConversations) {
      try {
        conversations = JSON.parse(savedConversations);
        const index = conversations.findIndex(
          (c: any) => c.id === conversation.id
        );
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

    localStorage.setItem(
      'formito-conversations',
      JSON.stringify(conversations)
    );
    return of(true);
  }

  deleteConversation(conversationId: number): Observable<boolean> {
    const savedConversations = localStorage.getItem('formito-conversations');

    if (savedConversations) {
      try {
        const conversations = JSON.parse(savedConversations).filter(
          (c: any) => c.id !== conversationId
        );
        localStorage.setItem(
          'formito-conversations',
          JSON.stringify(conversations)
        );
      } catch (e) {
        console.error('Erreur lors de la suppression de la conversation:', e);
        return of(false);
      }
    }

    return of(true);
  }
}
