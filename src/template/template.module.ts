import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { QueryModule } from 'src/query/query.module';
import { AttributeModule } from 'src/attribute/attribute.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  imports: [QueryModule, AttributeModule],
})
export class TemplateModule {}
