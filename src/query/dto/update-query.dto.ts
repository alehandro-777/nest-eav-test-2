import { PartialType } from '@nestjs/swagger';
import { CreateQueryDto } from './create-query.dto';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateQueryDto extends PartialType(CreateQueryDto) {
    @ApiProperty()
    id: number;
}
