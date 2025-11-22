import { ApiProperty } from '@nestjs/swagger';

export class CreateQueryDto {
    @ApiProperty()
    name: string;
    @ApiProperty()
    params: string;
}
