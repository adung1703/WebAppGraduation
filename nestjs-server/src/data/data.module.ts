// src/data/data.module.ts
import { Module, OnModuleInit, Logger } from '@nestjs/common'; // Import OnModuleInit, Logger
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EnvironmentData, EnvironmentDataSchema } from './schemas/environment-data.schema';
import { DataService } from './data.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([
      { name: EnvironmentData.name, schema: EnvironmentDataSchema },
    ]),
  ],
  providers: [DataService],
  exports: [DataService],
})
export class DataModule implements OnModuleInit { // Implements OnModuleInit
  private readonly logger = new Logger(DataModule.name);
  constructor(private configService: ConfigService) {} // Inject ConfigService

  onModuleInit() {
    const mongoUri = this.configService.get<string>('MONGODB_URI');
    this.logger.log(`MongoDB URI from config: ${mongoUri}`); // Log giá trị MONGODB_URI
  }
}