import { PartialType } from '@nestjs/swagger';
import { CreateRowEavDto } from './create-row-eav.dto';

export class UpdateRowEavDto extends PartialType(CreateRowEavDto) {}
