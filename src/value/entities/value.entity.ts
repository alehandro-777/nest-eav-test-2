import { Value } from '../../!generated/prisma/client';

import { ApiProperty } from '@nestjs/swagger';

export class ValueE implements Value {
  @ApiProperty()
  id: number;
  @ApiProperty()
  ts: Date;
  @ApiProperty()
  ent: number;
  @ApiProperty()
  att:  number
  
  @ApiProperty()
  strVal:  string;
  @ApiProperty({ required: false, nullable: true })
  numVal: number  | null;
  @ApiProperty({ required: false, nullable: true })
  dtVal: Date | null;
  @ApiProperty({ required: false, nullable: true })
  blbVal: Uint8Array<ArrayBuffer> | null;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty({ required: false, nullable: true })
  updatedAt: Date | null;
  @ApiProperty({ required: false, nullable: true })
  deletedAt: Date | null;
}
