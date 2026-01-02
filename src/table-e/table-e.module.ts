import { Module } from '@nestjs/common';
import { TableEService } from './table-e.service';
import { TableEController } from './table-e.controller';
import { ColumnEModule } from 'src/column-e/column-e.module';
import { TableQueryService } from './table-query.service';
import { Table1Repo } from './table-1.repo';



@Module({
  imports: [ColumnEModule, ],
  controllers: [TableEController],
  providers: [TableEService, TableQueryService, Table1Repo, ],
})
export class TableEModule {}
