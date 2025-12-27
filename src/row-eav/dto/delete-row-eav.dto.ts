import { ApiProperty } from '@nestjs/swagger';

export class DeleteRowEavDto {
    @ApiProperty()
    row: number;
    @ApiProperty()
    col: number;
}
