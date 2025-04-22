// src/data/data.controller.ts
import { Controller, Get, Query, Logger, UseGuards } from '@nestjs/common';
import { DataService } from './data.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('history-data')
@UseGuards(JwtAuthGuard)
export class DataController {
  private readonly logger = new Logger(DataController.name);

  constructor(private readonly dataService: DataService) {}

  @Get()
  async getHistoryData(
    @Query('page') page = '1',
    @Query('limit') limit = '100',
  ) {
    try {
      const pageNumber = parseInt(page, 10) || 1;
      const limitNumber = parseInt(limit, 10) || 100;
      
      // Giới hạn số lượng tối đa mỗi trang là 100
      const validLimit = Math.min(limitNumber, 100);
      
      this.logger.log(`Retrieving history data: page ${pageNumber}, limit ${validLimit}`);
      
      const result = await this.dataService.getHistoryData(pageNumber, validLimit);
      return result;
    } catch (error) {
      this.logger.error('Failed to retrieve history data', error);
      throw error;
    }
  }
}