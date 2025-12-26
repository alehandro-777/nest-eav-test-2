import { Module } from '@nestjs/common';
import { ColumnEService } from './column-e.service';
import { ColumnEController } from './column-e.controller';

@Module({
  controllers: [ColumnEController],
  providers: [ColumnEService],
  exports: [ColumnEService],
})
export class ColumnEModule {}
