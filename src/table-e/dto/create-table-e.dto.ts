import { ApiProperty } from '@nestjs/swagger';

export class CreateTableEDto {}

export class CreateTable1 {
    id: number;
    col1: Date | null;
    col2: number | null;
    col3: number | null;
    col4: string;
    col5: string;
    col6: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    deletedAt: Date | null;
}
