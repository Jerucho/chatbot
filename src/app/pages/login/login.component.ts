import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormControl,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
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

  public formControl = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  onLogin(): void {
    this.emailError = '';
    this.passwordError = '';

    if (this.formControl.invalid) {
      if (this.getEmail()?.invalid) {
        this.emailError = 'Email is required';
      }
      if (this.getPassword()?.invalid) {
        this.passwordError = 'Password is required';
      }
      return;
    }

    alert('Login exitoso, navegando al dashboard...');
    // console.log('Botón clickeado - iniciando login...');
    // this.authService.login().subscribe({
    //   next: (success) => {
    //     if (success) {
    //       console.log('Login exitoso, navegando al dashboard...');
    //       this.router.navigate(['/dashboard']);
    //     }
    //   },
    //   error: (error) => {
    //     console.error('Error en el login:', error);
    //   },
    // });
  }

  getPassword() {
    return this.formControl.get('password');
  }

  getEmail() {
    return this.formControl.get('email');
  }
}
