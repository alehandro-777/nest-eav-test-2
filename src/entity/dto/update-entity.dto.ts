import { PartialType } from '@nestjs/swagger';
import { CreateEntityDto } from './create-entity.dto';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateEntityDto extends PartialType(CreateEntityDto) {
    @ApiProperty()
    id:number;
}
