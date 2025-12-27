import { RowEAV } from '../../!generated/prisma/client';

import { ApiProperty } from '@nestjs/swagger';


export class RowE implements RowEAV {
    id: number;
    row: number;
    col: number;
    strVal: string;
    numVal: number | null;
    dtVal: Date | null;
    blbVal: Uint8Array<ArrayBuffer> | null;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}
