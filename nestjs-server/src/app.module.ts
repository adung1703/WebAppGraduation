// src/app.module.ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { ConfigModule } from '@nestjs/config';
import { WebsocketGateway } from './websocket.gateway';
import { DataModule } from './data/data.module'; 
import { AuthModule } from './auth/auth.module'; 


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MqttModule,
    DataModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, WebsocketGateway],
})
export class AppModule {}