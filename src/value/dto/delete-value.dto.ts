
import { ApiProperty } from '@nestjs/swagger';


export class DeleteValueDto {
  @ApiProperty()
  ts: Date;
  @ApiProperty()
  ent: number;
  @ApiProperty()
  att: number;
}
