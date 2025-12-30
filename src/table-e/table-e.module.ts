import { Module } from '@nestjs/common';
import { TableEService } from './table-e.service';
import { TableEController } from './table-e.controller';
import { ColumnEModule } from 'src/column-e/column-e.module';
import { TableQueryService } from './table-query.service';



@Module({
  imports: [ColumnEModule, ],
  controllers: [TableEController],
  providers: [TableEService, TableQueryService,  ],
})
export class TableEModule {}
