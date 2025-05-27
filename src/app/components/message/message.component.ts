import { Component, Input, OnInit } from '@angular/core';
import { MessageCircleIcon } from 'lucide-angular';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Chat } from '../../pages/home/home.component';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent implements OnInit {
  readonly messageCircleIcon = MessageCircleIcon;
  @Input() message!: Chat;

  ngOnInit() {
    console.log('Mensaje recibido en MessageComponent:', this.message);
  }

  cambiarEstado() {
    console.log('Cambiando estado del mensaje:', this.message);
  }
}
