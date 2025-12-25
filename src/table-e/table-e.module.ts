import { Module } from '@nestjs/common';
import { TableEService } from './table-e.service';
import { TableEController } from './table-e.controller';

@Module({
  controllers: [TableEController],
  providers: [TableEService],
})
export class TableEModule {}
