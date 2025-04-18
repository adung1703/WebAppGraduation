// ./src/mqtt/mqtt.module.ts
import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { WebsocketGateway } from '../websocket.gateway'; // Import WebsocketGateway
import { DataModule } from '../data/data.module'; // Import DataModule

@Module({
  imports: [DataModule], // Thêm DataModule vào imports
  providers: [MqttService, WebsocketGateway], // Thêm WebsocketGateway
  controllers: [MqttController],
  exports: [MqttService, WebsocketGateway], // Export để có thể dùng ở controller
})
export class MqttModule { }
