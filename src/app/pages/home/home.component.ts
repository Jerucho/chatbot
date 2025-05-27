import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Message,
  MessagesListComponent,
  MessageType,
} from '../../components/messages-list/messages-list.component';
import { CommonModule } from '@angular/common';
import { SocketService } from '../../services/socket.service';
import { AuthService } from '../../services/auth.service';

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
  userId: string = '';
  public agentName: string = '';
  public advisorNotifications: AdvisorNotification[] = [];

  constructor(
    private socketService: SocketService,
    private authService: AuthService
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

          console.log('👤 Usuario cargado:', {
            agentName: this.agentName,
            userId: this.userId,
          });

          // 3. Unirse a la sala una vez que tenemos el userId
          if (this.userId) {
            this.socketService.joinRoom(this.userId);
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
