
import { ApiProperty } from '@nestjs/swagger';


export class CreateValueDto {

  @ApiProperty()
  ts:Date;


  @ApiProperty()
  entityId: number;


  @ApiProperty()
  attributeId:  number;


  @ApiProperty()
  stringVal:  string;


  @ApiProperty()
  numberVal:  number | null;

  @ApiProperty()
  boolVal: boolean | null;

  @ApiProperty()
  dateVal:  Date | null;    
}
