import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Message,
  MessagesListComponent,
  MessageType,
} from '../../components/messages-list/messages-list.component';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';
import { ChatService } from '../../services/chat.service';

export interface Chat {
  _id: string;
  userId: string;
  messages: {
    role: 'user' | 'assistant' | 'tool';
    content: string;
    timestamp: string;
    _id: string;
    tool_calls?: {
      id: string;
      type: string;
      function: {
        name: string;
        arguments: string;
      };
      _id: string;
    }[];
    tool_call_id?: string;
  }[];
  lastContactAt: string;
  needsHumanResponse: boolean;
  createdAt: string;
  __v: number;
  userName: string;
  assignedAdvisor?: string;
  agentResponseStatus: 'pending' | 'active' | 'finished';
}
interface AdvisorNotification {
  area: string;
  message: string;
  ruc?: string;
  acta_number?: string;
  timestamp: string;
}

@Component({
  selector: 'app-home',
  imports: [MessagesListComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  public userId: string = '';
  public agentName: string = '';
  private idUserDB: string = '';
  public areaName: string = '';
  public advisorNotifications: AdvisorNotification[] = [];

  constructor(
    private socketService: SocketService,
    private authService: AuthService,
    private chatService: ChatService
  ) {}

  ngOnInit() {
    // 1. Inicializar la conexión del socket
    this.socketService.initializeConnection();

    // 2. Obtener información del usuario y configurar el socket
    this.authService.getUserInfo().subscribe({
      next: (user) => {
        if (user) {
          this.agentName = user.agentName || '';
          this.userId = user.id_user || '';
          this.idUserDB = user.idUserDB || '';
          this.areaName = user.area || '';
          console.log('👤 Usuario cargado:', {
            agentName: this.agentName,
            userId: this.userId,
            areaName: this.areaName,
          });

          // 3. Unirse a la sala una vez que tenemos el userId
          if (this.userId) {
            this.socketService.joinRoom(this.userId);
            this.getChats();
          }
        }
      },
      error: (error) => {
        console.error('❌ Error obteniendo info de usuario:', error);
      },
    });

    // 4. Configurar el listener para notificaciones
    this.socketService.listen(
      'advisorNotification',
      (data: AdvisorNotification) => {
        console.log(
          '🔔 Notificación de asesor recibida en HomeComponent:',
          data
        );
        this.advisorNotifications.push(data);
      }
    );
  }

  ngOnDestroy(): void {
    this.socketService.off('advisorNotification');
    console.log('Listener de advisorNotification removido de HomeComponent.');
  }

  public messagesTypes: MessageType[] = [
    'Nuevo',
    'En Proceso',
    'Resuelto',
    'Archivado',
  ];

  public chats: Chat[] = [];

  getChats() {
    this.chatService.getChats(this.idUserDB).subscribe({
      next: (response) => {
        console.log('Respuesta completa del servidor:', response);
        if (response && response.pendingMessages) {
          this.chats = response.pendingMessages;
          console.log('💬 Chats obtenidos:', this.chats);
        } else {
          console.error('❌ Formato de respuesta inválido:', response);
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener chats:', error);
      },
    });
  }

  getFinishedChats() {
    return this.chats.filter((chat) => chat.agentResponseStatus === 'finished');
  }

  getActiveChats() {
    return this.chats.filter((chat) => chat.agentResponseStatus === 'active');
  }

  getNewChats() {
    return this.chats.filter((chat) => chat.agentResponseStatus === 'pending');
  }
}
