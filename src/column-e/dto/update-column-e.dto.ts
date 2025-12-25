import { PartialType } from '@nestjs/swagger';
import { CreateColumnEDto } from './create-column-e.dto';

export class UpdateColumnEDto extends PartialType(CreateColumnEDto) {}
