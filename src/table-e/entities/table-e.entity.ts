import { Table1, TableE } from '../../!generated/prisma/client';


export class Table implements TableE {
    query: string;
    name: string;
    id: number;
}

export class Table_1 implements Table1 {
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
