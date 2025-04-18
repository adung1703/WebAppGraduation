// src/mqtt/mqtt.service.ts
import { Injectable, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
import { ConfigService } from '@nestjs/config';
import { Subject } from 'rxjs'; // Import Subject

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
    private client: MqttClient;
    private readonly logger = new Logger(MqttService.name);
    private _connected$ = new Subject<void>(); // Tạo một Subject

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        await this.connect();
    }

    async connect() {
        const host = this.configService.get<string>('MQTT_HOST');
        const port = this.configService.get<number>('MQTT_PORT', 8883);
        const clientId = `${this.configService.get<string>('MQTT_CLIENT_ID')}${Math.random().toString(16).slice(3)}`;
        const connectUrl = `mqtts://${host}:${port}`;
        const username = this.configService.get<string>('MQTT_USERNAME');
        const password = this.configService.get<string>('MQTT_PASSWORD');
        const topic = this.configService.get<string>('MQTT_TOPIC', 'esp32/test');

        if (!topic) {
            this.logger.warn('MQTT_TOPIC is not defined use default topic');
        }

        this.client = mqtt.connect(connectUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: username,
            password: password,
            reconnectPeriod: 1000,
        });

        return new Promise<void>((resolve, reject) => {
            this.client.on('connect', () => {
                this.logger.log('Connected to HiveMQ Cloud');
                this.client.subscribe([topic], () => {
                    this.logger.log(`Subscribed to topic '${topic}'`);
                });
                this._connected$.next(); // Phát sự kiện khi kết nối thành công
                resolve();
            });

            this.client.on('error', (err) => {
                this.logger.error('Connection error: ', err);
                this.client.end();
                reject(err);
            });
        });
    }

    onModuleDestroy() {
        if (this.client) {
            this.client.end()
        }
    }

    getClient(): MqttClient {
        return this.client;
    }

    get connected$() { // Getter cho Subject
        return this._connected$.asObservable();
    }
}