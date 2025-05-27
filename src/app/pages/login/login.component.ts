import { Component } from '@angular/core';
import { AuthService, LoginRequest } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) {}

  public emailError = '';
  public passwordError = '';
  public loginError = '';
  public isLoading = false;

  public formControl = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onLogin(): void {
    this.emailError = '';
    this.passwordError = '';
    this.loginError = '';

    if (this.formControl.invalid) {
      if (this.getEmail()?.invalid) {
        this.emailError = 'Email is required';
      }
      if (this.getPassword()?.invalid) {
        this.passwordError = 'Password is required';
      }
      return;
    }

    const loginRequest: LoginRequest = {
      email: this.formControl.get('email')?.value || '',
      password: this.formControl.get('password')?.value || '',
    };

    this.isLoading = true;

    this.authService
      .login(loginRequest)
      .pipe(
        // Después del login exitoso, verificamos la autenticación
        switchMap(() => this.authService.isAuthenticated())
      )
      .subscribe({
        next: (isAuthenticated) => {
          this.isLoading = false;
          if (isAuthenticated) {
            console.log(
              'Login exitoso y usuario autenticado, navegando al dashboard...'
            );
            this.router.navigate(['/dashboard']);
          } else {
            console.error('Login exitoso pero usuario no autenticado');
            this.loginError = 'Error de autenticación. Intenta nuevamente.';
          }
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error en el login:', error);

          if (error.status === 401) {
            this.loginError = 'Credenciales inválidas';
          } else {
            this.loginError = 'Error del servidor. Intenta nuevamente.';
          }
        },
      });
  }

  getPassword() {
    return this.formControl.get('password');
  }

  getEmail() {
    return this.formControl.get('email');
  }
}
