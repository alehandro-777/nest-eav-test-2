import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityController } from './entity.controller';

@Module({
  controllers: [EntityController],
  providers: [EntityService],
  imports: [],
})
export class EntityModule {}
