import { inject, Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;
  private isInitialized = false;

  constructor(private authService: AuthService) {
    // Inicializar socket sin userId primero
    this.socket = io(environment.apiUrl, {
      autoConnect: false, // No conectar automáticamente
      withCredentials: true, // Enviar cookies para autenticación
    });

    this.setupSocketEvents();
  }

  private setupSocketEvents(): void {
    this.socket.on('connect', () => {
      console.log('🔗 Conectado al servidor Socket.IO');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Desconectado del servidor Socket.IO');
    });

    this.socket.on('connect_error', (err: any) => {
      console.error('Socket.IO connection error:', err.message);
    });
  }

  // Método para inicializar la conexión con el userId
  initializeConnection(): void {
    if (this.isInitialized) {
      console.log('Socket ya inicializado');
      return;
    }

    this.authService.getUserInfo().subscribe({
      next: (user) => {
        if (user?.id_user) {
          console.log('🚀 Inicializando socket con userId:', user.id_user);

          // Configurar el socket con el userId
          this.socket.io.opts.query = { userId: user.id_user };

          // Conectar al socket
          this.socket.connect();

          this.isInitialized = true;
        } else {
          console.error('❌ No se pudo obtener userId para socket');
        }
      },
      error: (error) => {
        console.error('❌ Error obteniendo info de usuario:', error);
      },
    });
  }

  // Método para verificar si está conectado y conectar si no lo está
  ensureConnection(): Promise<void> {
    return new Promise((resolve) => {
      if (this.socket.connected) {
        resolve();
        return;
      }

      if (!this.isInitialized) {
        this.initializeConnection();
      }

      // Esperar a que se conecte
      this.socket.on('connect', () => {
        resolve();
      });

      // Si no está conectado después de 5 segundos, resolver de todos modos
      setTimeout(() => {
        resolve();
      }, 5000);
    });
  }

  listen(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  joinRoom(userId: string): void {
    this.ensureConnection().then(() => {
      if (this.socket.connected && userId) {
        this.socket.emit('joinRoom', userId);
        console.log(`Socket unido a la sala: ${userId}`);
      } else {
        console.warn('Socket no conectado o userId vacío');
      }
    });
  }

  off(event: string, callback?: (data: any) => void): void {
    this.socket.off(event, callback);
  }

  disconnect(): void {
    this.socket.disconnect();
    this.isInitialized = false;
  }

  // Getter para verificar estado de conexión
  get isConnected(): boolean {
    return this.socket.connected;
  }
}
