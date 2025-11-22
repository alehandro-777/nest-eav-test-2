import { PartialType } from '@nestjs/swagger';
import { CreateAttributeDto } from './create-attribute.dto';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {
        @ApiProperty()
      typeId :   number;
}
