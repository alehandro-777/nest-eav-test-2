import { ApiProperty } from '@nestjs/swagger';



export class CreateAttributeDto {
    @ApiProperty()

  typeId :   number;
    @ApiProperty()

  rangeId  : number;
    @ApiProperty()

  KVSetId?  : number;
}
