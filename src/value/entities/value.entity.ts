import { Value } from '../../!generated/prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class ValueE implements Value {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ts: Date;
  @ApiProperty()
  entityId: number;
  @ApiProperty()
  attributeId:  number
  @ApiProperty()
  stringVal:  string;
   @ApiProperty({ required: false, nullable: true })
  numberVal: number  | null;
   @ApiProperty({ required: false, nullable: true })
  boolVal: boolean | null;
   @ApiProperty({ required: false, nullable: true })
  dateVal: Date | null;
}
