import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getChats(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/api/pending/${userId}`, {
      withCredentials: true,
    });
  }
}
