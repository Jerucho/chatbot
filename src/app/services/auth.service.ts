import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // private apiUrl = 'http://localhost:3000/api/auth';
  private isLoggedIn = false;

  constructor(private http: HttpClient) {}

  login(): Observable<boolean> {
    // Simula una llamada a la API para autenticar al usuario
    return of(true).pipe(
      tap(() => {
        this.isLoggedIn = true;
        console.log('Usuario logueado');
      })
    );
  }

  logout(): void {
    this.isLoggedIn = false;
    console.log('Usuario deslogueado');
  }

  isAuthenticated(): boolean {
    // Aquí podrías verificar un token en localStorage, etc.
    return this.isLoggedIn;
  }
}
