import { Module } from '@nestjs/common';
import { RowEavService } from './row-eav.service';
import { RowEavController } from './row-eav.controller';

@Module({
  controllers: [RowEavController],
  providers: [RowEavService],
  exports: [RowEavService],
})
export class RowEavModule {}
