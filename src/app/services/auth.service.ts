import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface UserResponse {
  id_user: string;
  agentName: string;
  idUserDB: string;
  area: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/auth/login`, request, {
        withCredentials: true, // Importante: incluir cookies en la petición
      })
      .pipe(
        tap((response) => {
          console.log('Login response:', response);
        }),
        map((response) => {
          return response;
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.http
      .get<UserResponse>(`${this.apiUrl}/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          console.log('/auth/me response:', response);
        }),
        map((response) => {
          // Verificamos que vengan ambas propiedades
          return !!(response?.id_user && response?.agentName);
        }),
        catchError((error) => {
          console.error('Error in isAuthenticated:', error);
          return of(false);
        })
      );
  }

  getUserInfo(): Observable<UserResponse | null> {
    return this.http
      .get<UserResponse>(`${this.apiUrl}/auth/me`, {
        withCredentials: true,
      })
      .pipe(
        catchError((error) => {
          console.error('Error getting user info:', error);
          return of(null);
        })
      );
  }

  logout(): Observable<any> {
    // Aquí puedes agregar una llamada al endpoint de logout si lo tienes
    return this.http
      .post(
        `${this.apiUrl}/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error during logout:', error);
          return of(null);
        })
      );
  }
}
