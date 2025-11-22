import { Module } from '@nestjs/common';
import { QueryService } from './query.service';
import { QueryController } from './query.controller';


@Module({
  controllers: [QueryController],
  providers: [QueryService],
  imports: [],
  exports:[QueryService]
})
export class QueryModule {}
