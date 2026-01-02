import { PartialType } from '@nestjs/swagger';
import { CreateEdto } from './create-table-e.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEdto extends PartialType(CreateEdto) {
    id: number;
}

