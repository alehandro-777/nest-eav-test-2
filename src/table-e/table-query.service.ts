import { Injectable,  } from '@nestjs/common';
import { Table1Repo } from './table-1.repo';
import { UpdateEdto } from './dto/update-table-e.dto';
import { DeleteEdto } from './dto/delete-table-e.dto';


@Injectable()
export class TableQueryService {
    constructor(private Table1Repo: Table1Repo)  {}

    async findMany(id: number, ts:string, from:string, to:string, )  {
        let res:any = [];
        switch (id) {
            case 1:                
                res  = await this.Table1Repo.findMany( ts, from, to);
        
        }

        return this.transform1(res);
    }

    upsert(id: number, upsertRowDto: UpdateEdto[])  {
        switch (id) {
            case 1:                
                return this.Table1Repo.upsert( upsertRowDto);
        }
    }

    softDelete(id: number, deleteRowDto: DeleteEdto[])  {
        switch (id) {
            case 1:                
                return this.Table1Repo.softDelete( deleteRowDto);
        }
    }
    
    //для единообразия
    transform1(rowset: any[]): Map<string, any>  {

        const map = new Map<string, any>();

        for (let i = 0; i < rowset.length; i++) {
            const row = rowset[i];
            map.set(row.id, row);
        }

        return map;
    }
}