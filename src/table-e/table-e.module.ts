import { Module } from '@nestjs/common';
import { TableEService } from './table-e.service';
import { TableEController } from './table-e.controller';
import { ColumnEModule } from 'src/column-e/column-e.module';
import { RowEavModule } from 'src/row-eav/row-eav.module';


@Module({
  imports: [ColumnEModule, RowEavModule],
  controllers: [TableEController],
  providers: [TableEService],
})
export class TableEModule {}
