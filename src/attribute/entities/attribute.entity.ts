import { Attribute } from '../../!generated/prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class AttributeE  implements Attribute {
    @ApiProperty()    
    name: string;
    @ApiProperty()    
    id: number;
    @ApiProperty()    
    typeId: number;
    @ApiProperty()    
    rangeId: number | null;
    @ApiProperty()    
    KVSetId: number | null;    
}
