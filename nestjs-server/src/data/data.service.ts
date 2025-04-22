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

  async getHistoryData(page = 1, limit = 100): Promise<{ data: EnvironmentData[], total: number, page: number, totalPages: number }> {
    try {
      const skip = (page - 1) * limit;
      
      // Thực hiện hai truy vấn song song
      const [data, total] = await Promise.all([
        this.environmentDataModel.find()
          .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian tạo
          .skip(skip)
          .limit(limit)
          .exec(),
        this.environmentDataModel.countDocuments()
      ]);
      
      const totalPages = Math.ceil(total / limit);
      
      return {
        data,
        total,
        page,
        totalPages
      };
    } catch (error) {
      this.logger.error('Error retrieving history data from MongoDB:', error);
      throw error;
    }
  }
}