import { Module } from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import { QueryModule } from 'src/query/query.module';

@Module({
  controllers: [TemplateController],
  providers: [TemplateService],
  imports: [QueryModule],
})
export class TemplateModule {}
