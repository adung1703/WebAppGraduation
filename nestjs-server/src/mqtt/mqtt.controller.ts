// src/mqtt/mqtt.controller.ts
import { Controller, Logger, OnModuleInit } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { WebsocketGateway } from '../websocket.gateway';
import { take } from 'rxjs/operators';
import { DataService } from '../data/data.service'; // Import DataService

@Controller('mqtt')
export class MqttController implements OnModuleInit {
  private readonly logger = new Logger(MqttController.name);

  constructor(
    private readonly mqttService: MqttService,
    private readonly websocketGateway: WebsocketGateway,
    private readonly dataService: DataService, // Inject DataService
  ) { }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing MQTT message handler...');

    this.mqttService.connected$.pipe(take(1)).subscribe(() => {
      this.mqttService.getClient().on('message', async (topic, payload) => { // Thêm async
        this.logger.log(`Received message from ${topic}: ${payload.toString()}`);

        try {
          const data = JSON.parse(payload.toString());

          // Lưu dữ liệu vào MongoDB
          await this.dataService.saveData(data); // Gọi DataService để lưu

          this.websocketGateway.emit('mqttData', data);
          this.logger.log('Data sent to WebSocket clients and saved to MongoDB.');
        } catch (error) {
          this.logger.error('Error processing MQTT message:', error);
        }
      });
    });
  }
}