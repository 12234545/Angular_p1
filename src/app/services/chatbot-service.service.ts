// chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}
