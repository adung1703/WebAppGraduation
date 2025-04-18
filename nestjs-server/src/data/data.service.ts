// src/data/data.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EnvironmentData, EnvironmentDataDocument } from './schemas/environment-data.schema';

@Injectable()
export class DataService {
  private readonly logger = new Logger(DataService.name);

  constructor(
    @InjectModel(EnvironmentData.name) private environmentDataModel: Model<EnvironmentDataDocument>,
  ) {}

  async saveData(data: any): Promise<EnvironmentData> {
    try {
      const createdData = new this.environmentDataModel(data);
      return await createdData.save();
    } catch (error) {
      this.logger.error('Error saving data to MongoDB:', error);
      throw error; // Re-throw lỗi để controller có thể xử lý nếu cần
    }
  }
}