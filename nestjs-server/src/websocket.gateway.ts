// ./src/websocket.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: '*' },
})
@Injectable()
export class WebsocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private readonly logger = new Logger(WebsocketGateway.name);
  private connectedClients: number = 0; // Thêm biến đếm client

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.connectedClients++; // Tăng biến đếm khi có client kết nối
    this.logger.log(`Client connected: ${client.id}. Total clients: ${this.connectedClients}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedClients--; // Giảm biến đếm khi client ngắt kết nối
    this.logger.log(`Client disconnected: ${client.id}. Total clients: ${this.connectedClients}`);
  }

  emit(event: string, data: any) {
    if (this.server && this.connectedClients > 0) { // Kiểm tra số lượng clients
      this.server.emit(event, data);
      this.logger.debug(`Emitted event: ${event} to ${this.connectedClients} clients`);
    } else {
      this.logger.debug('No WebSocket clients connected, data not emitted.');
    }
  }
}