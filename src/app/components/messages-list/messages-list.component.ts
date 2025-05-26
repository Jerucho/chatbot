import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MessageComponent } from '../message/message.component';
export type MessageType = 'Nuevo' | 'En Proceso' | 'Resuelto' | 'Archivado';
export type Area = 'Finanzas' | 'Compras' | 'Ventas' | 'Recursos Humanos';

export interface Message {
  title: string;
  type: MessageType;
  area: Area;
  content: string;
  status: string;
  createdAt: string;
  sender: string;
}

@Component({
  selector: 'app-messages-list',
  imports: [CommonModule, MessageComponent],
  templateUrl: './messages-list.component.html',
  styleUrl: './messages-list.component.css',
})
export class MessagesListComponent {
  @Input() messageType: MessageType = 'Nuevo';
  @Input() messages: Message[] = [];
}
