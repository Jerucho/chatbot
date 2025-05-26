import { Component, Input } from '@angular/core';
import { MessageCircleIcon } from 'lucide-angular';
import { Message } from '../messages-list/messages-list.component';
import { LucideAngularModule } from 'lucide-angular';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-message',
  imports: [LucideAngularModule, CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.css',
})
export class MessageComponent {
  readonly messageCircleIcon = MessageCircleIcon;
  @Input() message: Message = {
    title: '',
    content: '',
    area: 'Finanzas',
    type: 'Nuevo',
    status: 'Pendie',
    createdAt: '',
    sender: '',
  };
}
