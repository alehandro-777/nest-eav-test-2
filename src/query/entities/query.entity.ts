import { Query } from '../../!generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class QueryE implements Query {
    @ApiProperty()
    name: string;
    @ApiProperty()
    id: number;
    @ApiProperty()
    params: string;
}
