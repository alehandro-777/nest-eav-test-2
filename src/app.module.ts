import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ValueModule } from './value/value.module';
import { QueryModule } from './query/query.module';
import { AttributeModule } from './attribute/attribute.module';
import { EntityModule } from './entity/entity.module';
import { TemplateModule } from './template/template.module';
import { TableEModule } from './table-e/table-e.module';
import { ColumnEModule } from './column-e/column-e.module';
import { DateService } from './table-e/date.service';



@Module({
  imports: [ValueModule, QueryModule, AttributeModule, EntityModule, TemplateModule, TableEModule, ColumnEModule, ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
