import { Component } from '@angular/core';
import {
  Message,
  MessagesListComponent,
  MessageType,
} from '../../components/messages-list/messages-list.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-home',
  imports: [MessagesListComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  public messagesTypes: MessageType[] = [
    'Nuevo',
    'En Proceso',
    'Resuelto',
    'Archivado',
  ];

  public messages: Message[] = [
    {
      title: 'Mensaje 1',
      type: 'Nuevo',
      area: 'Finanzas',
      content: 'Contenido del mensaje 1',
      status: 'Activo',
      createdAt: '2021-01-01',
      sender: 'Juan Perez',
    },
    {
      title: 'Mensaje 2',
      type: 'Nuevo',
      area: 'Compras',
      content: 'Contenido del mensaje 2',
      status: 'Activo',
      createdAt: '2021-01-01',
      sender: 'Juan Perez',
    },
    {
      title: 'Mensaje 3',
      type: 'Archivado',
      area: 'Ventas',
      content: 'Contenido del mensaje 3',
      status: 'Activo',
      createdAt: '2021-01-01',
      sender: 'Juan Perez',
    },
  ];

  public getMessagesByType(type: string): Message[] {
    if (type === 'Todos') {
      return this.messages;
    }
    return this.messages.filter((message) => message.type === type);
  }
}
