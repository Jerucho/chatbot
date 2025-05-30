import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LucideAngularModule } from 'lucide-angular';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LucideAngularModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'chatbot';
}
