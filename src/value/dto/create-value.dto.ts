
import { ApiProperty } from '@nestjs/swagger';


export class CreateValueDto {
  @ApiProperty()
  ts:Date;
  @ApiProperty()
  ent: number;
  @ApiProperty()
  att:  number;
  @ApiProperty()
  strVal:  string;
  @ApiProperty({ required: false, nullable: true })
  numVal:  number | null;
  @ApiProperty({ required: false, nullable: true })
  dtVal:  Date | null;
  @ApiProperty({ required: false, nullable: true })
  blbVal: Uint8Array<ArrayBuffer> | null;
}
