import { PartialType } from '@nestjs/swagger';
import { CreateTableEDto } from './create-table-e.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTableEDto extends PartialType(CreateTableEDto) {}
