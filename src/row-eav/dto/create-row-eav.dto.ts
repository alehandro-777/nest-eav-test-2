import { ApiProperty } from '@nestjs/swagger';

export class CreateRowEavDto {
    @ApiProperty()
    row: number;
    @ApiProperty()
    col: number;
    @ApiProperty()
    strVal: string;
    @ApiProperty()
    numVal: number | null;
    @ApiProperty()
    dtVal: Date | null;
    @ApiProperty()
    blbVal: Uint8Array<ArrayBuffer> | null;
    @ApiProperty()
    createdAt: Date | null;
    @ApiProperty()
    updatedAt: Date | null;
    @ApiProperty()
    deletedAt: Date | null;
}
