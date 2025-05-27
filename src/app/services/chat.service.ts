import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getChats(userId: string) {
    return this.http.get<any>(`${this.apiUrl}/pending/${userId}`, {
      withCredentials: true,
    });
  }
}
